import importlib
import httpx
import re
import pytest


def _get_app():
    mod = importlib.import_module("sevdo_frontend.frontend_compiler")
    mod = importlib.reload(mod)
    return mod.app


def _count(s: str, sub: str) -> int:
    return len(re.findall(re.escape(sub), s))


@pytest.mark.anyio
async def test_generated_jsx_is_structurally_valid(tmp_path):
    app = _get_app()
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        inp = tmp_path / "valid.dsl"
        out = tmp_path / "valid.jsx"
        inp.write_text(
            "\n".join(
                [
                    "c(",
                    "  n(Home,About)",
                    "  h(Welcome)",
                    "  t(Hello)",
                    "  img(logo.png){alt=Logo}",
                    "  sel(One,Two)",
                    "  c(t(Inner)){class=mt-4}",
                    "  f(i(email,label=Email) b(Save){onClick=save})",
                    ")",
                ]
            ),
            encoding="utf-8",
        )

        resp = await client.post(
            "/api/fe-translate/to-s",
            json={
                "input_path": str(inp),
                "output_path": str(out),
                "include_imports": True,
                "component_name": "ValidTest",
            },
        )
        assert resp.status_code == 200, resp.text

        jsx = out.read_text(encoding="utf-8")

        # Basic React/JSX scaffolding checks
        assert "import React from 'react';" in jsx
        assert "export default function ValidTest()" in jsx
        assert "return (" in jsx and ");" in jsx
        assert "<>" in jsx and "</>" in jsx

        # Container/form closing tags must be present
        assert _count(jsx, "<div className=\"flex flex-col gap-4") == _count(jsx, "</div>")
        assert _count(jsx, "<form>") == _count(jsx, "</form>")

        # Self-closing inputs and images
        for line in jsx.splitlines():
            if "<input" in line:
                assert "/>" in line
            if "<img" in line:
                assert "/>" in line

        # Select should wrap options
        if "<select" in jsx:
            assert "</select>" in jsx
            assert "<option" in jsx and "</option>" in jsx

        # Sanity: parentheses balance for wrapper (not a full parser, but stable for our output)
        # Our generator only uses parentheses in function signature/return and attribute values don't contain them.
        assert jsx.count("(") == jsx.count(")")


