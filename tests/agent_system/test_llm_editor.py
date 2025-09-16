from __future__ import annotations

from pathlib import Path
import os
import sys

from llm_editor_test import run_test, CAPITAL_FILE


def main() -> int:
    # Allow passing a custom GPU base URL via env var or CLI (optional)
    gpu_base_url = os.environ.get("GPU_AGENT_BASE_URL")
    if len(sys.argv) > 1:
        gpu_base_url = sys.argv[1]

    path = run_test(gpu_base_url=gpu_base_url)
    content = Path(path).read_text(encoding="utf-8")

    ok = "paris" in content.lower()
    print(f"capital.txt content preview:\n{content}")

    if ok:
        print("OK: content mentions Paris")
        return 0
    else:
        print("FAIL: content does not mention Paris")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
