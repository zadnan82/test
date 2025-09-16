from typing import List, Dict, Any
import os
from pathlib import Path

import ollama  # pyright: ignore[reportMissingImports]
import json

from .coding_agent import solve_subtask
from .rag_integration import AgentRAGService


def discover_sevdo_files() -> Dict[str, str]:
    """Discover existing .s files in templates directory for context-aware planning."""
    project_root = Path(__file__).parent.parent
    templates_dir = project_root / "templates"
    
    sevdo_files = {}
    if templates_dir.exists():
        for file_path in templates_dir.rglob("*.s"):
            try:
                content = file_path.read_text(encoding="utf-8")
                relative_path = str(file_path.relative_to(project_root))
                sevdo_files[relative_path] = content
            except Exception as e:
                print(f"Warning: Could not read {file_path}: {e}")
    
    return sevdo_files


def plan_subtasks(task: str, model: str = "llama3.2:latest") -> Dict[str, Any]:
    """
    Enhanced planning that uses file discovery and RAG for context-aware task decomposition.
    Returns subtasks with file context and suggested SEVDO tokens.
    """
    
    # Discover existing SEVDO files for context
    sevdo_files = discover_sevdo_files()
    
    # Build file context for the prompt
    file_context = ""
    if sevdo_files:
        file_context = "\n\nExisting SEVDO files in project:\n"
        for file_path, content in sevdo_files.items():
            file_context += f"- {file_path}: {content.strip()[:100]}...\n"
        file_context += "\nWhen modifying existing files, reference them specifically in subtasks.\n"

    system_prompt = (
        "You are a sprintmaster working with an existing SEVDO project. Break the user's task into "
        "the smallest set of absolutely necessary subtasks. For modifications to existing files, "
        "specify the exact file to modify. For new features, create specific subtasks."
        "\n\nRules:"
        "\n- Return 1-4 bullet points, each a short imperative phrase"
        "\n- Provide difficulty level 1-3 for each subtask"
        "\n- Reference specific .s files when modifying existing components"
        "\n- Use format: 'Modify {file}: change X to Y' or 'Create new component: description'"
        "\n\nSEVDO uses letters/groups for components (frontend: h,t,i,b,lf,rf; backend: l,r,m,o)"
        + file_context
    )

    user_prompt = f"Task: {task}\n\nProvide focused subtasks that leverage the available patterns and tokens."

    response = ollama.chat(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        options={"temperature": 0.5},
        format={
            "type": "object", 
            "properties": {
                "subtasks": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "task": {"type": "string"},
                            "difficulty": {"type": "number"}
                        }
                    }
                }
            }
        },
    )
    print(response["message"]["content"])
    try:
        subtasks = json.loads(response["message"]["content"])
        if "subtasks" not in subtasks:
            print(f"Warning: No 'subtasks' key in response: {subtasks}")
            # Fallback: create simple subtask list
            subtasks = {
                "subtasks": [
                    {"description": "Complete the task", "difficulty": 2}
                ]
            }
    except (json.JSONDecodeError, KeyError) as e:
        print(f"Error parsing ollama response: {e}")
        print(f"Raw response: {response}")
        # Fallback to simple format
        subtasks = {
            "subtasks": [{"description": "Complete the task", "difficulty": 2}]
        }

    return {"subtasks": subtasks["subtasks"]}


def execute_task(
    task: str,
    master_model: str = "llama3.2:latest",
    code_model: str = "deepseek-coder:6.7b",
) -> Dict[str, Any]:
    """
    Enhanced task execution using RAG system for context-aware planning and execution.
    """
    # Initialize RAG service
    rag_service = AgentRAGService()

    # Use RAG-enhanced planning
    planning_result = plan_subtasks(task, model=master_model)
    subtasks = planning_result["subtasks"]

    # Execute subtasks with RAG context
    results: List[Dict[str, Any]] = []
    for sub in subtasks:
        # Handle both dict and string formats for compatibility
        if isinstance(sub, dict):
            sub_description = sub.get("task", str(sub))
        else:
            sub_description = str(sub)

        result = solve_subtask(sub_description, rag_service, model=code_model)
        # Add RAG metadata to result
        results.append(result)

    return {"task": task, "subtasks": subtasks, "results": results}
