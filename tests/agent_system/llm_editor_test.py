from __future__ import annotations

from pathlib import Path
from typing import Optional, Any, Dict
from urllib.parse import quote

import requests


GPU_ENV_VAR = "GPU_AGENT_BASE_URL"  # unused in hardcoded test, kept for reference
DEFAULT_MODEL = "llama3.2:3b"
CAPITAL_FILE = Path(__file__).parent / "capital.txt"

# Hardcoded base URL for the GPU FastAPI server as requested
HARDCODED_GPU_BASE_URL = "http://192.168.16.103:8000"


def _extract_text_from_gpu_response(payload: Any) -> str:
    if isinstance(payload, str):
        return payload
    if isinstance(payload, dict):
        # Try common structures
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

    try:
        resp.raise_for_status()
    except requests.HTTPError as e:
        raise RuntimeError(
            f"GPU endpoint returned {resp.status_code}: {resp.text[:200]}") from e

    try:
        data = resp.json()
    except ValueError:
        data = resp.text

    text = _extract_text_from_gpu_response(data)
    if not isinstance(text, str) or not text.strip():
        raise RuntimeError(
            "GPU response did not contain usable 'content' text")
    return text


def ask_capital_of_france(*, gpu_base_url: Optional[str] = None, model: str = DEFAULT_MODEL, timeout: int = 30) -> Dict[str, Any]:
    """Call the GPU endpoint with the test prompt using hardcoded base and /ollama route."""
    base = (HARDCODED_GPU_BASE_URL or "").rstrip("/")
    prompt = "What is the capital of France?"
    encoded_model = quote(model, safe='')
    encoded_prompt = quote(prompt, safe='')

    url = f"{base}/ollama/{encoded_model}/{encoded_prompt}"
    try:
        content = _post_and_parse(url, timeout)
        return {"status": "success", "content": content, "url": url}
    except Exception as e:
        return {"status": "failed", "error": str(e), "url": url}


def write_capital_text(content: str) -> Path:
    """Overwrite capital.txt with the provided content."""
    CAPITAL_FILE.write_text(content, encoding="utf-8")
    return CAPITAL_FILE


def run_test(*, gpu_base_url: Optional[str] = None, model: str = DEFAULT_MODEL) -> Path:
    """End-to-end: ask GPU, then write the exact returned content to capital.txt."""
    result = ask_capital_of_france(gpu_base_url=gpu_base_url, model=model)
    if result.get("status") != "success":
        raise RuntimeError(
            f"GPU call failed: {result.get('error')} (url={result.get('url')})")
    content = result["content"]
    return write_capital_text(content)


if __name__ == "__main__":
    path = run_test()
    print(f"Wrote GPU response to {path}")
