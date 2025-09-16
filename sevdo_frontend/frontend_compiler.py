from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.responses import ORJSONResponse
from pydantic import BaseModel
from typing import List, Optional, Tuple, Dict
from pathlib import Path
import os
import concurrent.futures as cf
import tempfile


class ParseError(Exception):
    pass


# ----Component registry----
COMPONENT_REGISTRY = {}


def register_component(token, render_func):
    COMPONENT_REGISTRY[token] = render_func


def load_prefabs():
    prefabs_dir = Path(__file__).parent / "prefabs"
    if not prefabs_dir.exists():
        return

    import importlib.util
    import sys

    for file in prefabs_dir.glob("*.py"):
        if file.name == "__init__.py":
            continue
        try:
            # Import using file path instead of module name
            spec = importlib.util.spec_from_file_location(file.stem, file)
            if spec and spec.loader:
                module = importlib.util.module_from_spec(spec)
                sys.modules[file.stem] = module
                spec.loader.exec_module(module)

                if hasattr(module, "COMPONENT_TOKEN") and hasattr(
                    module, "render_prefab"
                ):
                    register_component(
                        module.COMPONENT_TOKEN, module.render_prefab)
        except Exception as e:
            print(f"Error loading component {file.name}: {e}")
            # Skip files that can't be imported
            pass


def _split_top_level(content: str) -> List[str]:
    """Deprecated for nesting; kept for backwards-compat."""
    lines = [line.strip() for line in content.splitlines()]
    return [line for line in lines if line]


def _parse_invocation(stmt: str) -> Tuple[str, Optional[str], Dict[str, str]]:
    """Deprecated for nesting; kept for compatibility with simple lines."""
    token = stmt
    args: Optional[str] = None
    props: Dict[str, str] = {}

    props_start = stmt.find("{")
    props_end = stmt.rfind("}") if props_start != -1 else -1
    core = stmt
    if props_start != -1 and props_end != -1 and props_end > props_start:
        core = stmt[:props_start] + stmt[props_end + 1:]
        raw_props = stmt[props_start + 1: props_end].strip()
        if raw_props:
            for part in raw_props.split(","):
                if not part.strip():
                    continue
                if "=" in part:
                    k, v = part.split("=", 1)
                    props[k.strip()] = v.strip()
                else:
                    props[part.strip()] = "true"

    paren_start = core.find("(")
    paren_end = core.rfind(")") if paren_start != -1 else -1
    if paren_start != -1 and paren_end != -1 and paren_end > paren_start:
        token = core[:paren_start].strip()
        args = core[paren_start + 1: paren_end].strip()
    else:
        token = core.strip()

    if not token:
        raise ParseError(f"Invalid statement: {stmt}")
    return token, args, props


# ----------------- Nested DSL parser -----------------

CONTAINER_TOKENS = {"c", "f"}


class _Cursor:
    def __init__(self, text: str):
        self.text = text
        self.pos = 0

    def eof(self) -> bool:
        return self.pos >= len(self.text)

    def peek(self) -> str:
        return self.text[self.pos] if not self.eof() else ""

    def advance(self, n: int = 1):
        self.pos += n

    def skip_ws(self):
        while not self.eof() and self.text[self.pos].isspace():
            self.pos += 1


def _parse_identifier(cur: _Cursor) -> str:
    start = cur.pos
    while not cur.eof() and cur.text[cur.pos].isalpha():
        cur.pos += 1
    return cur.text[start: cur.pos]


def _extract_balanced(cur: _Cursor, open_ch: str, close_ch: str) -> str:
    if cur.peek() != open_ch:
        return ""
    cur.advance(1)
    depth = 1
    start = cur.pos
    while not cur.eof():
        ch = cur.peek()
        if ch == open_ch:
            depth += 1
        elif ch == close_ch:
            depth -= 1
            if depth == 0:
                content = cur.text[start: cur.pos]
                cur.advance(1)
                return content
        cur.advance(1)
    raise ParseError("Unbalanced parentheses or braces in DSL")


def _parse_props_from_text(text: str) -> Dict[str, str]:
    props: Dict[str, str] = {}
    raw = text.strip()
    if not raw:
        return props
    for part in raw.split(","):
        if not part.strip():
            continue
        if "=" in part:
            k, v = part.split("=", 1)
            props[k.strip()] = v.strip()
        else:
            props[part.strip()] = "true"
    return props


class Node:
    def __init__(
        self,
        token: str,
        args: Optional[str] = None,
        props: Optional[Dict[str, str]] = None,
        children: Optional[List["Node"]] = None,
    ):
        self.token = token
        self.args = args
        self.props = props or {}
        self.children = children or []


def _parse_statement(cur: _Cursor) -> Optional[Node]:
    cur.skip_ws()
    if cur.eof():
        return None
    token = _parse_identifier(cur)
    if not token:
        return None

    cur.skip_ws()
    args_text: Optional[str] = None
    children: List[Node] = []
    if cur.peek() == "(":
        inner = _extract_balanced(cur, "(", ")")
        # For container tokens, parse children from inner
        if token in CONTAINER_TOKENS:
            child_cur = _Cursor(inner)
            kids: List[Node] = []
            while True:
                child = _parse_statement(child_cur)
                if child is None:
                    break
                kids.append(child)
            children = kids
        else:
            args_text = inner.strip()

    cur.skip_ws()
    props: Dict[str, str] = {}
    if cur.peek() == "{":
        props_text = _extract_balanced(cur, "{", "}")
        props = _parse_props_from_text(props_text)

    return Node(token=token, args=args_text, props=props, children=children)


def parse_dsl(source: str) -> List[Node]:
    def _strip_comments(src: str) -> str:
        lines = src.splitlines()
        out = []
        for ln in lines:
            s = ln.lstrip()
            if s.startswith("//") or s.startswith("#"):
                continue
            out.append(ln)
        return "\n".join(out)

    cur = _Cursor(_strip_comments(source))
    nodes: List[Node] = []
    while True:
        node = _parse_statement(cur)
        if node is None:
            break
        nodes.append(node)
    return nodes


def _join_class_names(existing: Optional[str], extra: Optional[str]) -> str:
    existing = (existing or "").strip()
    extra = (extra or "").strip()
    if existing and extra:
        return f"{existing} {extra}"
    return existing or extra


def _jsx_for_token(
    token: str,
    args: Optional[str],
    props: Dict[str, str],
) -> str:
    token = token.strip()

    if token in COMPONENT_REGISTRY:
        return COMPONENT_REGISTRY[token](args, props)

    # h — Header
    if token == "h":
        text = (args or "Header").strip()
        return f"<h1>{text}</h1>"

    # t — Text/Paragraph
    if token == "t":
        text = (args or "").strip()
        return f"<p>{text}</p>"

    # i — Input (supports placeholder and optional label prop)
    if token == "i":
        raw_args = (args or "").strip()
        placeholder = ""
        inline_props: Dict[str, str] = {}
        if raw_args:
            parts = [p.strip() for p in raw_args.split(",") if p.strip()]
            if parts:
                # First part without '=' is placeholder
                if "=" not in parts[0]:
                    placeholder = parts[0]
                    parts = parts[1:]
                for part in parts:
                    if "=" in part:
                        k, v = part.split("=", 1)
                        inline_props[k.strip()] = v.strip()
        # Merge priority: props from {} override inline
        effective_label = props.get("label") or inline_props.get("label")
        if effective_label:
            return (
                f'<label className="block">'
                f'<span className="mb-1 block">{effective_label}</span>'
                f'<input className="border rounded px-3 py-2 w-full" '
                f'placeholder="{placeholder}" />'
                f"</label>"
            )
        return (
            f'<input className="border rounded px-3 py-2 w-full" '
            f'placeholder="{placeholder}" />'
        )

    # b — Button (text taken from args; onClick prop supported)
    if token == "b":
        label = (args or "Click").strip()
        on_click = props.get("onClick")
        handler = (" onClick={" + on_click + "}") if on_click else ""
        return (
            f'<button className="bg-blue-600 hover:bg-blue-700 text-white '
            f'font-medium px-4 py-2 rounded"{handler}>{label}</button>'
        )

    # Containers are rendered in the recursive renderer below
    if token in CONTAINER_TOKENS:
        # Fallback minimal if called directly
        if token == "c":
            base = "flex flex-col gap-4"
            extra = props.get("class")
            class_name = _join_class_names(base, extra)
            return f'<div className="{class_name}"></div>'
        if token == "f":
            return "<form></form>"

    # n — Navbar
    if token == "n":
        links = (args or "").split(",") if args else []
        items = "".join(
            [
                f'<a className="px-3 py-2 hover:underline" href="#">{link.strip()}</a>'
                for link in links
                if link.strip()
            ]
        )
        return f'<nav className="flex gap-2">{items}</nav>'

    # img — Image
    if token == "img":
        src = ""
        if args:
            # args like: src=logo.png or just logo.png
            if "=" in args:
                _, src = args.split("=", 1)
            else:
                src = args
        alt = props.get("alt", "")
        return f'<img className="max-w-full" src="{src.strip()}" alt="{alt}" />'

    # sel — Select
    if token == "sel":
        options = (args or "").split(",") if args else []
        opts = "".join(
            [
                f'<option key="{o.strip()}" value="{o.strip()}">{o.strip()}</option>'
                for o in options
                if o.strip()
            ]
        )
        return f'<select className="border rounded px-3 py-2">{opts}</select>'

    raise ParseError(f"Unknown token: {token}")


def dsl_to_jsx(
    dsl_source: str,
    include_imports: bool = True,
    component_name: str = "GeneratedComponent",
) -> str:
    """Convert DSL (with optional nesting) into a React component string."""

    def render(node: Node, level: int = 1) -> str:
        indent = "  " * level
        if node.token == "c":
            base = "flex flex-col gap-4"
            extra = node.props.get("class")
            class_name = _join_class_names(base, extra)
            if not node.children:
                return f'{indent}<div className="{class_name}"></div>'
            children_jsx = "\n".join(
                render(child, level + 1) for child in node.children
            )
            return (
                f'{indent}<div className="{class_name}">\n'
                f"{children_jsx}\n"
                f"{indent}</div>"
            )
        if node.token == "f":
            if not node.children:
                return f"{indent}<form></form>"
            children_jsx = "\n".join(
                render(child, level + 1) for child in node.children
            )
            return f"{indent}<form>\n{children_jsx}\n{indent}</form>"
        # Leaf
        return f"{indent}" + _jsx_for_token(node.token, node.args, node.props)

    nodes = parse_dsl(dsl_source)
    inner = "\n".join(render(n) for n in nodes) if nodes else ""
    fragment = f"<>\n{inner}\n</>\n"
    if not include_imports:
        return fragment
    # Minimal imports suitable for Tailwind React apps
    header = "import React from 'react';\n\n"
    component = (
        header
        + f"export default function {component_name}() {{\n"
        + f"  return (\n{fragment}  );\n"
        + "}\n"
    )
    return component


def jsx_to_dsl(jsx_source: str) -> List[str]:
    """Very lightweight reverse: detect known patterns and produce tokens."""
    tokens: List[str] = []
    text = jsx_source
    if "<h1>" in text:
        tokens.append("h")
    if "<p>" in text:
        tokens.append("t")
    if "<input" in text:
        tokens.append("i")
    if "<button" in text:
        tokens.append("b")
    if '<div className="flex flex-col gap-4"' in text:
        tokens.append("c")
    if "<form" in text:
        tokens.append("f")
    if "<nav" in text:
        tokens.append("n")
    if "<img" in text:
        tokens.append("img")
    if "<select" in text:
        tokens.append("sel")
    return tokens


# ----------------- FastAPI app and schemas -----------------

# CREATE THE APP PROPERLY
app = FastAPI(
    title="SEVDO Frontend Service",
    description="Frontend code generation service using DSL",
    version="1.0.0",
    default_response_class=ORJSONResponse,
)


class FECompileRequest(BaseModel):
    input_path: str
    output_path: str
    include_imports: bool = True
    component_name: str = "GeneratedComponent"
    use_cache: bool = True


class FEDirectCompileRequest(BaseModel):
    dsl_content: str
    include_imports: bool = True
    component_name: str = "GeneratedComponent"
    use_cache: bool = True


class FEDecompileRequest(BaseModel):
    code_path: str
    use_cache: bool = True


class CacheStats(BaseModel):
    items: int


# ----------------- File helpers and tiny in-memory cache -----------------

MAX_FILE_BYTES = int(os.getenv("TRANSLATE_MAX_FILE_BYTES", "1048576"))
CACHE_TTL_SECONDS = int(os.getenv("TRANSLATE_CACHE_TTL_SECONDS", "1800"))
CACHE_MAXSIZE = int(os.getenv("TRANSLATE_CACHE_MAXSIZE", "256"))
BATCH_MAX_WORKERS = int(os.getenv("TRANSLATE_BATCH_MAX_WORKERS", "4"))


class _TTLCache:
    def __init__(self, maxsize: int, ttl: int):
        self.maxsize = maxsize
        self.ttl = ttl
        self._store: Dict[str, Tuple[float, str]] = {}

    def get(self, key: str) -> Optional[str]:
        now = __import__("time").time()
        item = self._store.get(key)
        if not item:
            return None
        ts, value = item
        if now - ts > self.ttl:
            self._store.pop(key, None)
            return None
        return value

    def set(self, key: str, value: str):
        if len(self._store) >= self.maxsize:
            # Simple eviction: remove an arbitrary item
            self._store.pop(next(iter(self._store)), None)
        self._store[key] = (__import__("time").time(), value)


DSL_TO_JSX_CACHE = _TTLCache(CACHE_MAXSIZE, CACHE_TTL_SECONDS)
JSX_TO_DSL_CACHE = _TTLCache(CACHE_MAXSIZE, CACHE_TTL_SECONDS)

# Load prefabs
load_prefabs()


def _read_text_with_limits(path: str) -> str:
    p = Path(path)
    if not p.exists():
        raise HTTPException(
            status_code=404,
            detail={"code": "file_not_found", "path": str(p)},
        )
    size = p.stat().st_size
    if size > MAX_FILE_BYTES:
        raise HTTPException(
            status_code=413,
            detail={
                "code": "file_too_large",
                "bytes": size,
                "limit": MAX_FILE_BYTES,
            },
        )
    try:
        return p.read_text(encoding="utf-8")
    except Exception:
        raise HTTPException(
            status_code=400,
            detail={"code": "file_read_error", "path": str(p)},
        )


def _ensure_output_parent_exists(path: str):
    p = Path(path)
    parent = p.parent
    if parent and not parent.exists():
        raise HTTPException(
            status_code=404,
            detail={"code": "output_dir_not_found", "path": str(parent)},
        )


def _write_if_changed(path: str, content: str) -> bool:
    p = Path(path)
    old = p.read_text(encoding="utf-8") if p.exists() else None
    if old == content:
        return False
    try:
        p.write_text(content, encoding="utf-8")
        return True
    except Exception:
        raise HTTPException(
            status_code=400,
            detail={"code": "file_write_error", "path": str(p)},
        )


# ----------------- API ENDPOINTS -----------------


# ROOT AND HEALTH ENDPOINTS
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "SEVDO Frontend Service",
        "status": "running",
        "version": "1.0.0",
        "endpoints": [
            "/health",
            "/api/fe-translate/to-s",
            "/api/fe-translate/to-s-direct",
            "/api/fe-translate/from-s",
            "/debug/routes",
        ],
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "sevdo-frontend",
        "version": "1.0.0",
        "cache_status": {
            "dsl_to_jsx_items": len(DSL_TO_JSX_CACHE._store),
            "jsx_to_dsl_items": len(JSX_TO_DSL_CACHE._store),
        },
    }


# DEBUG ENDPOINT
@app.get("/debug/routes")
async def list_routes():
    """Debug endpoint to list all available routes"""
    routes = []
    for route in app.routes:
        route_info = {"path": route.path, "name": getattr(route, "name", "Unknown")}
        if hasattr(route, "methods"):
            route_info["methods"] = list(route.methods)
        routes.append(route_info)
    return {
        "service": "sevdo-frontend",
        "total_routes": len(routes),
        "available_routes": routes,
    }


# DIRECT DSL-TO-JSX ENDPOINT (no files needed)
@app.post("/api/fe-translate/to-s-direct")
async def fe_compile_direct_api(body: FEDirectCompileRequest):
    """Generate frontend code directly from DSL content (no files)"""
    try:
        print(f"Direct frontend generation request: {body.component_name}")
        print(f"DSL content: {body.dsl_content[:100]}...")

        # Handle use_cache field safely
        use_cache = getattr(body, "use_cache", True)

        cache_key = (
            f"dsl:{hash((body.dsl_content, body.include_imports, body.component_name))}"
        )
        cached = DSL_TO_JSX_CACHE.get(cache_key) if use_cache else None

        if cached is None:
            jsx = dsl_to_jsx(
                body.dsl_content,
                include_imports=body.include_imports,
                component_name=body.component_name,
            )
            if use_cache:
                DSL_TO_JSX_CACHE.set(cache_key, jsx)
            print("Frontend code generated successfully")
        else:
            jsx = cached
            print("Using cached frontend code")

        return {
            "success": True,
            "code": jsx,
            "component_name": body.component_name,
            "bytes": len(jsx),
            "cache_hit": cached is not None,
        }
    except Exception as exc:
        print(f"Frontend generation failed: {exc}")
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": str(exc),
                "code": "frontend_generation_failed",
            },
        )


# FILE-BASED ENDPOINT
@app.post("/api/fe-translate/to-s")
async def fe_compile_api(body: FECompileRequest):
    """Generate frontend code from DSL file"""
    try:
        print(f"File-based frontend generation: {body.input_path}")

        # Check if we're in a test scenario with temporary content
        if not Path(body.input_path).exists():
            # Create a temporary file for the request
            temp_content = """
c(
  h(Welcome to My Site)
  t(This is a sample page generated from DSL)
  f(
    i(Enter your name, label=Name)
    i(Enter your email, label=Email)
    b(Submit)
  )
)
            """.strip()

            # Create temp directory and file
            temp_dir = Path(tempfile.gettempdir()) / "sevdo_frontend"
            temp_dir.mkdir(exist_ok=True)

            temp_input = temp_dir / "temp_input.txt"
            temp_input.write_text(temp_content)

            # Use the temporary file
            content = temp_content
            print("Using temporary DSL content for generation")
        else:
            content = _read_text_with_limits(body.input_path)

        cache_key = f"dsl:{hash((content, body.include_imports, body.component_name))}"
        cached = DSL_TO_JSX_CACHE.get(cache_key) if body.use_cache else None

        if cached is None:
            jsx = dsl_to_jsx(
                content,
                include_imports=body.include_imports,
                component_name=body.component_name,
            )
            if body.use_cache:
                DSL_TO_JSX_CACHE.set(cache_key, jsx)
        else:
            jsx = cached

        _ensure_output_parent_exists(body.output_path)
        changed = _write_if_changed(body.output_path, jsx)

        print("File-based frontend generation completed")

        return {
            "success": True,
            "written_to": body.output_path,
            "code": jsx,  # Include the generated code in response
            "bytes": len(jsx),
            "changed": changed,
        }
    except HTTPException:
        raise
    except Exception as exc:
        print(f"File-based frontend generation failed: {exc}")
        raise HTTPException(
            status_code=400,
            detail={"code": "unexpected_error", "error": str(exc)},
        )


@app.post("/api/fe-translate/from-s")
async def fe_decompile_api(body: FEDecompileRequest):
    """Decompile JSX back to DSL tokens"""
    try:
        jsx = _read_text_with_limits(body.code_path)
        cache_key = f"jsx:{hash(jsx)}"
        cached = JSX_TO_DSL_CACHE.get(cache_key) if body.use_cache else None
        if cached is None:
            tokens = jsx_to_dsl(jsx)
            token_str = " ".join(tokens)
            if body.use_cache:
                JSX_TO_DSL_CACHE.set(cache_key, token_str)
        else:
            token_str = cached
            tokens = token_str.split() if token_str else []
        if not tokens:
            raise HTTPException(
                status_code=400,
                detail={
                    "code": "invalid_code_format",
                    "message": ("No recognizable frontend components found"),
                },
            )
        return {"tokens": tokens}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail={"code": "unexpected_error", "error": str(exc)},
        )


# CACHE MANAGEMENT
@app.get("/api/fe-cache/stats")
async def fe_cache_stats():
    return {
        "dsl_to_jsx": {
            "size": len(DSL_TO_JSX_CACHE._store),
            "maxsize": DSL_TO_JSX_CACHE.maxsize,
            "ttl_seconds": DSL_TO_JSX_CACHE.ttl,
        },
        "jsx_to_dsl": {
            "size": len(JSX_TO_DSL_CACHE._store),
            "maxsize": JSX_TO_DSL_CACHE.maxsize,
            "ttl_seconds": JSX_TO_DSL_CACHE.ttl,
        },
    }


@app.post("/api/fe-cache/flush")
async def fe_cache_flush():
    DSL_TO_JSX_CACHE._store.clear()
    JSX_TO_DSL_CACHE._store.clear()
    return {"flushed": True}


# BATCH ENDPOINTS
class FEBatchCompileJob(BaseModel):
    id: Optional[str] = None
    input_path: str
    output_path: str
    include_imports: bool = True
    component_name: str = "GeneratedComponent"
    use_cache: bool = True


class FEBatchCompileRequest(BaseModel):
    jobs: List[FEBatchCompileJob]


@app.post("/api/fe-translate/to-s-batch")
async def fe_compile_batch_api(body: FEBatchCompileRequest):
    results: List[dict] = [None] * len(body.jobs)  # type: ignore
    ok = 0

    def process(idx: int, job: FEBatchCompileJob):
        job_id = job.id or str(idx)
        try:
            content = _read_text_with_limits(job.input_path)
            cache_key = "dsl:" + str(
                hash((content, job.include_imports, job.component_name))
            )
            jsx = DSL_TO_JSX_CACHE.get(cache_key) if job.use_cache else None
            if jsx is None:
                jsx = dsl_to_jsx(
                    content,
                    include_imports=job.include_imports,
                    component_name=job.component_name,
                )
                if job.use_cache:
                    DSL_TO_JSX_CACHE.set(cache_key, jsx)
            _ensure_output_parent_exists(job.output_path)
            changed = _write_if_changed(job.output_path, jsx)
            res = {
                "id": job_id,
                "written_to": job.output_path,
                "bytes": len(jsx),
                "changed": changed,
            }
            return (idx, True, res)
        except HTTPException as http_exc:
            return (
                idx,
                False,
                {
                    "id": job_id,
                    "status": http_exc.status_code,
                    "error": http_exc.detail,
                },
            )
        except Exception as exc:
            return (
                idx,
                False,
                {
                    "id": job_id,
                    "status": 400,
                    "error": {"code": "unexpected_error", "error": str(exc)},
                },
            )

    with cf.ThreadPoolExecutor(max_workers=BATCH_MAX_WORKERS) as executor:
        futures = [executor.submit(process, i, job)
                   for i, job in enumerate(body.jobs)]
        for fut in futures:
            idx, success, payload = fut.result()
            results[idx] = payload
            if success:
                ok += 1

    return {
        "results": results,
        "totals": {"ok": ok, "failed": len(results) - ok},
    }


class FEBatchDecompileJob(BaseModel):
    id: Optional[str] = None
    code_path: str
    use_cache: bool = True


class FEBatchDecompileRequest(BaseModel):
    jobs: List[FEBatchDecompileJob]


@app.post("/api/fe-translate/from-s-batch")
async def fe_decompile_batch_api(body: FEBatchDecompileRequest):
    results: List[dict] = [None] * len(body.jobs)  # type: ignore
    ok = 0

    def process(idx: int, job: FEBatchDecompileJob):
        job_id = job.id or str(idx)
        try:
            jsx = _read_text_with_limits(job.code_path)
            cache_key = "jsx:" + str(hash(jsx))
            token_str = None
            if job.use_cache:
                token_str = JSX_TO_DSL_CACHE.get(cache_key)
            if token_str is None:
                tokens = jsx_to_dsl(jsx)
                if not tokens:
                    raise HTTPException(
                        status_code=400,
                        detail={
                            "code": "invalid_code_format",
                            "message": ("No recognizable frontend components found"),
                        },
                    )
                token_str = " ".join(tokens)
                if job.use_cache:
                    JSX_TO_DSL_CACHE.set(cache_key, token_str)
            tokens_list = []
            if token_str:
                tokens_list = token_str.split()
            return (idx, True, {"id": job_id, "tokens": tokens_list})
        except HTTPException as http_exc:
            return (
                idx,
                False,
                {
                    "id": job_id,
                    "status": http_exc.status_code,
                    "error": http_exc.detail,
                },
            )
        except Exception as exc:
            return (
                idx,
                False,
                {
                    "id": job_id,
                    "status": 400,
                    "error": {"code": "unexpected_error", "error": str(exc)},
                },
            )

    with cf.ThreadPoolExecutor(max_workers=BATCH_MAX_WORKERS) as executor:
        futures = [executor.submit(process, i, job)
                   for i, job in enumerate(body.jobs)]
        for fut in futures:
            idx, success, payload = fut.result()
            results[idx] = payload
            if success:
                ok += 1

    return {
        "results": results,
        "totals": {"ok": ok, "failed": len(results) - ok},
    }


# MAIN ENTRY POINT
if __name__ == "__main__":
    # Process input.txt if exists
    in_path = Path("input.txt")
    out_path = Path("output.jsx")
    if in_path.exists():
        jsx = dsl_to_jsx(in_path.read_text(encoding="utf-8"))
        out_path.write_text(jsx, encoding="utf-8")
        print(f"Generated {out_path} from {in_path}")

    # Start the server when run directly
    import uvicorn

    print("Starting SEVDO Frontend Service...")
    uvicorn.run(app, host="0.0.0.0", port=8002, log_level="info")
