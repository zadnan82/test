# agent_system/llm_editor.py
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Optional, Tuple, List, Any
import re
import os
import requests
from urllib.parse import quote

import ollama  # requires OLLAMA_HOST to point to GPU

try:
    from .rag_integration import AgentRAGService
except Exception:
    AgentRAGService = None  # Optional


@dataclass
class LLMEditResult:
    success: bool
    modified: bool
    replacements: int
    original_code: str
    modified_code: str
    wrote_file: bool
    file_path: Optional[str] = None
    used_fallback: bool = False
    message: Optional[str] = None

    def to_response(self) -> dict:
        """Serialize to a consistent API-style dict with status and error fields."""
        return {
            "status": "success" if self.success else "failed",
            "success": self.success,
            "modified": self.modified,
            "replacements": self.replacements,
            "original_code": self.original_code,
            "modified_code": self.modified_code,
            "wrote_file": self.wrote_file,
            "file_path": self.file_path,
            "used_fallback": self.used_fallback,
            "error": None if self.success else (self.message or "Unknown error"),
            "message": self.message,
        }


def _get_allowed_tokens() -> List[str]:
    if AgentRAGService:
        try:
            rag = AgentRAGService()
            return rag.get_all_tokens() or []
        except Exception:
            pass
    # fallback set (frontend + backend common)
    return ["h", "t", "i", "b", "n", "img", "sel", "lf", "rf", "c", "f", "pg", "mn", "ft", "cd", "tt", "qa", "em", "ch", "l", "o", "r", "u", "m", "t", "a", "s", "k"]


def _sevdo_rules_summary() -> str:
    return (
        "SEVDO DSL rules (v1):\n"
        "- Program: sequence of statements. Statement: token(args){props}\n"
        "- args/props optional. props: comma-separated key=value; flags without '=' are true.\n"
        "- Containers c(...) and f(...) accept nested statements; other tokens do not.\n"
        "- Unknown tokens are forbidden. Use ONLY the allowed tokens.\n"
        "- Examples: h(Title) t(Welcome) i(email,label=Email) b(Save){onClick=save}\n"
        "- Do not emit JSX/HTML/JSON or code fences; output ONLY the SEVDO file content.\n"
    )


def _build_system_prompt(allowed_tokens: List[str]) -> str:
    allowed = ", ".join(sorted(set(allowed_tokens)))
    return (
        "You are a precise SEVDO DSL editor. Apply the user's task to the provided SEVDO file content.\n"
        "CRITICAL OUTPUT RULES:\n"
        "- Output ONLY the full, final SEVDO file content. No explanations, no code fences, no JSON.\n"
        "- Make the minimal change required. Preserve all unrelated formatting and whitespace.\n"
        "- Do not introduce or remove lines unless necessary for the change.\n\n"
        + _sevdo_rules_summary()
        + f"Allowed tokens: {allowed}\n"
        "If a requested change conflicts with SEVDO rules, do not perform it—keep the file valid.\n"
    )


def _parse_change_from_task(task: str) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    t = task.strip()
    m = re.search(
        r"change\s+['\"]?(.+?)['\"]?\s+to\s+['\"]?(.+?)['\"]?", t, re.I)
    token = None
    old_val = None
    new_val = None
    if m:
        old_val, new_val = m.group(1), m.group(2)
        m_old = re.match(r"([A-Za-z]+)\((.+)\)$", old_val)
        m_new = re.match(r"([A-Za-z]+)\((.+)\)$", new_val)
        if m_old and (not m_new or m_old.group(1) == m_new.group(1)):
            token = m_old.group(1)
            old_val = m_old.group(2)
            if m_new:
                new_val = m_new.group(2)
    return token, old_val, new_val


def _apply_token_arg_replacement(text: str, token: Optional[str], search: str, replace: str):
    if token:
        pattern = rf"(\b{re.escape(token)}\()\s*{re.escape(search)}\s*(?=[,\)])"
    else:
        pattern = rf"(\b[A-Za-z]+\()\s*{re.escape(search)}\s*(?=[,\)])"
    repl = r"\1" + replace
    return re.subn(pattern, repl, text)


def _build_user_prompt_for_gpu(task: str, code: str, allowed_tokens: List[str]) -> str:
    """Compose a single human prompt text embedding the SEVDO rules for the GPU endpoint."""
    rules = _build_system_prompt(allowed_tokens)
    return (
        "FOLLOW THESE INSTRUCTIONS EXACTLY.\n\n"
        + rules
        + "\nTASK:\n" + task
        + "\n\nSEVDO file content (full):\n"
        + "-----BEGIN FILE-----\n" + code + "\n-----END FILE-----\n\n"
        + "Return ONLY the new full SEVDO file content with the change applied."
    )


def _extract_text_from_gpu_response(payload: Any) -> str:
    if isinstance(payload, str):
        return payload
    if isinstance(payload, dict):
        msg = payload.get("message")
        if isinstance(msg, dict):
            content = msg.get("content")
            if isinstance(content, str):
                return content
        for key in ("content", "text", "output"):
            val = payload.get(key)
            if isinstance(val, str):
                return val
        data = payload.get("data") if isinstance(
            payload.get("data"), dict) else None
        if data and isinstance(data.get("content"), str):
            return data["content"]
    if isinstance(payload, list) and payload:
        first = payload[0]
        if isinstance(first, str):
            return first
        if isinstance(first, dict):
            return _extract_text_from_gpu_response(first)
    return ""


def _post_and_parse(url: str, timeout: int) -> str:
    try:
        resp = requests.post(url, timeout=timeout)
    except requests.RequestException as e:
        raise RuntimeError(f"Network error calling GPU endpoint: {e}") from e

    if resp.status_code == 404:
        raise requests.HTTPError("404", response=resp)
    try:
        resp.raise_for_status()
    except requests.HTTPError as e:
        # Include server text to aid debugging
        raise RuntimeError(
            f"GPU endpoint returned {resp.status_code}: {resp.text[:200]}"
        ) from e

    try:
        data = resp.json()
    except ValueError:
        data = resp.text

    text = _extract_text_from_gpu_response(data)
    if not isinstance(text, str) or not text.strip():
        raise RuntimeError(
            "GPU response did not contain usable 'content' text")
    return text


def _call_gpu_endpoint_edit(base_url: str, model: str, prompt_text: str, timeout: int = 60) -> str:
    """Call the GPU server endpoint, trying /ollama then /ollama_fc. URL-encode model and prompt."""
    base = base_url.rstrip("/")
    encoded_model = quote(model, safe='')
    encoded_prompt = quote(prompt_text, safe='')
    candidates = [
        f"{base}/ollama/{encoded_model}/{encoded_prompt}",
        f"{base}/ollama_fc/{encoded_model}/{encoded_prompt}",
    ]

    last_err: Optional[Exception] = None
    for url in candidates:
        try:
            return _post_and_parse(url, timeout)
        except requests.HTTPError as e:
            if getattr(e, "response", None) is not None and e.response.status_code == 404:
                last_err = e
                continue
            last_err = e
            break
        except Exception as e:
            last_err = e
            break

    hint = ""
    if ":11434" in base:
        hint = " It looks like you passed the Ollama port (11434). Use the FastAPI GPU server base URL (e.g., http://<host>:8000)."
    raise RuntimeError(
        f"Failed to call GPU endpoint at {base}. Last error: {last_err}.{hint}")


def _call_llm_edit(task: str, code: str, model: str, allowed_tokens: List[str], gpu_base_url: Optional[str]) -> str:
    """Route LLM call: prefer GPU HTTP endpoint if provided, else local Ollama API."""
    if gpu_base_url:
        prompt_text = _build_user_prompt_for_gpu(task, code, allowed_tokens)
        return _call_gpu_endpoint_edit(gpu_base_url, model, prompt_text)

    # Fallback to local ollama client with explicit system/user messages
    system_prompt = _build_system_prompt(allowed_tokens)
    user_prompt = (
        f"Task:\n{task}\n\n"
        "SEVDO file content (full):\n"
        "-----BEGIN FILE-----\n"
        f"{code}\n"
        "-----END FILE-----\n\n"
        "Return ONLY the new full SEVDO file content with the change applied."
    )
    try:
        resp = ollama.chat(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            options={"temperature": 0},
        )
    except Exception as e:
        raise RuntimeError(f"Local Ollama call failed: {e}") from e
    content = resp.get("message", {}).get("content", "")
    if not isinstance(content, str) or not content.strip():
        raise RuntimeError("Local Ollama returned empty content")
    return content


def apply_llm_edit(
    *,
    task: str,
    file_path: Optional[str] = None,
    code: Optional[str] = None,
    model: str = "deepseek-coder:6.7b",
    dry_run: bool = False,
    allow_fallback: bool = True,
    gpu_base_url: Optional[str] = None,
) -> LLMEditResult:
    if not file_path and code is None:
        return LLMEditResult(False, False, 0, "", "", False, None, False, "Provide either file_path or code.")

    p: Optional[Path] = Path(file_path).resolve() if file_path else None
    if p and not p.exists():
        return LLMEditResult(False, False, 0, "", "", False, str(p), False, "File not found.")

    original = (p.read_text(encoding="utf-8") if p else code) or ""
    allowed_tokens = _get_allowed_tokens()
    # Allow env var override for convenience
    if gpu_base_url is None:
        gpu_base_url = os.environ.get("GPU_AGENT_BASE_URL")

    try:
        modified = _call_llm_edit(
            task=task,
            code=original,
            model=model,
            allowed_tokens=allowed_tokens,
            gpu_base_url=gpu_base_url,
        ) or ""
    except Exception as e:
        return LLMEditResult(False, False, 0, original, original, False, str(p) if p else None, False, f"LLM call failed: {e}")

    used_fallback = False
    replacements = 0

    if not modified.strip() or modified == original:
        if allow_fallback:
            token, search, replace = _parse_change_from_task(task)
            if search and replace:
                modified, replacements = _apply_token_arg_replacement(
                    original, token, search, replace)
                if replacements == 0 and token:
                    modified, replacements = _apply_token_arg_replacement(
                        original, None, search, replace)
                used_fallback = replacements > 0
            else:
                replacements = 0

    changed = (modified != original) or replacements > 0

    wrote = False
    if p and changed and not dry_run:
        p.write_text(modified, encoding="utf-8")
        wrote = True

    message: Optional[str] = None
    if not changed and not replacements:
        message = "No change produced."

    return LLMEditResult(
        success=changed,
        modified=changed,
        replacements=replacements,
        original_code=original,
        modified_code=modified if modified else original,
        wrote_file=wrote,
        file_path=str(p) if p else None,
        used_fallback=used_fallback,
        message=message,
    )
