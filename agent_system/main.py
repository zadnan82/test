import json
import sys

from .sprintmaster import execute_task


def main() -> None:
    if len(sys.argv) < 2:
        print(
            'Usage: python -m agent_system.main "Your task description" [--rag]'
        )
        print("  --rag: Enable RAG-enhanced planning and execution")
        sys.exit(1)

    task = sys.argv[1]
    use_rag = "--rag" in sys.argv

    if use_rag:
        print("🧠 Using RAG-enhanced agent system...")
        result = execute_task(task)
    else:
        print("🤖 No RAG-enhanced agent system...")

    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
