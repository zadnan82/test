from typing import Dict, Any, Optional
import re
import requests
import random
import os
from urllib.parse import quote_plus

from .rag_integration import AgentRAGService


def compile_tokens(tokens: str, is_frontend: bool) -> Dict[str, Any]:
    """Compile SEVDO tokens to actual code using the compiler APIs."""
    with open(
        f"playground/input_files/generated_code{random.randint(1, 1000000)}.txt",
        "w",
    ) as f:
        f.write(tokens)
    try:
        fe_base = os.environ.get("SEVDO_FRONTEND_URL", "http://sevdo-frontend:8002")
        be_base = os.environ.get("SEVDO_BACKEND_URL", "http://sevdo-backend:8001")
        if is_frontend:
            response = requests.post(
                f"{fe_base}/api/fe-translate/to-s-direct",
                json={
                    "dsl_content": tokens,
                    "component_name": "GeneratedComponent",
                    "include_imports": True,
                },
                timeout=10,
            )
        else:
            token_list = tokens.split()
            response = requests.post(
                f"{be_base}/api/translate/to-s-direct",
                json={"tokens": token_list, "include_imports": True},
                timeout=10,
            )

        if response.status_code == 200:
            return {"success": True, "result": response.json()}
        else:
            return {
                "success": False,
                "error": f"Compiler error: {response.status_code}",
            }

    except requests.exceptions.RequestException as e:
        return {"success": False, "error": f"Connection error: {e}"}
    except Exception as e:
        return {"success": False, "error": f"Compilation error: {e}"}


def solve_subtask(
    subtask: str,
    rag_service: AgentRAGService,
    model: str = "llama3.2:3b",
) -> Dict[str, Any]:
    """
    Minimal coding agent that calls Ollama to produce a concise plan or code for a subtask.

    Returns a dict containing the subtask, the generated answer, and basic metadata.
    """

    rag_context = rag_service.get_relevant_context(subtask)
    suggested_tokens = rag_service.suggest_tokens(subtask)

    # Determine context for token filtering with broader keywords
    is_backend = any(
        keyword in subtask.lower()
        for keyword in [
            "api",
            "endpoint",
            "backend",
            "server",
            "database",
            "auth",
            "login system",
            "registration system",
            "credentials",
            "validate",
            "validation",
            "session",
            "token",
            "logout",
            "register",
        ]
    )
    is_frontend = any(
        keyword in subtask.lower()
        for keyword in [
            "html",
            "page",
            "form",
            "ui",
            "frontend",
            "website",
            "structure",
            "layout",
            "button",
            "input",
            "field",
            "username",
            "password",
            "text",
            "header",
            "navigation",
            "user",
            "display",
            "show",
            "render",
            "pattern",
        ]
    )

    # Default to frontend if unclear (most SEVDO use cases are UI)
    if not is_backend and not is_frontend:
        is_frontend = True

    rag_context_text = ""
    if rag_context:
        rag_context_text = "\n\nRelevant context from knowledge base:\n"
        for ctx in rag_context[:2]:  # Use top 2 most relevant
            rag_context_text += (
                f"- {ctx['title']}: {ctx['content'][:200]}...\n"
            )

    token_context = ""
    if suggested_tokens:
        token_context = f"\n\nSuggested SEVDO tokens that might be relevant: {', '.join(suggested_tokens)}"

    # Build enhanced context for coding agent
    enhanced_context = f"Original task: {subtask}"

    if suggested_tokens:
        enhanced_context += (
            f"\nSuggested SEVDO tokens: {', '.join(suggested_tokens)}"
        )
    if rag_context:
        enhanced_context += f"\nRelevant patterns: {rag_context[0]['title'] if rag_context else 'None'}"

    system_prompt = (
        "You are a focused coding agent. Given a subtask, and context, use the language SEVDO "
        "to complete it. You may only follow the context explaining the language SEVDO which "
        "uses letters and groups of letters to represent a code language. "
        "Follow the subtask completely and you can only use the letters given to you as context. "
        "CRITICAL: Output ONLY space-separated tokens. NO explanations whatsoever.\n\n"
        "Examples:\n"
        "User: 'login system'\n"
        "Assistant: l r m\n\n"
        "User: 'login form with inputs'\n"
        "Assistant: lf i i b\n\n"
        "User: 'contact page with form'\n"
        "Assistant: h t cf i b\n\n"
        "User: 'navigation with images'\n"
        "Assistant: n img img h" + rag_context_text + token_context
    )

    user_prompt = f"Subtask: {subtask}\n\nContext (optional): {enhanced_context or 'N/A'}"

    # Use FastAPI LLM gateway endpoint (configurable)
    base_url = os.environ.get("LLM_GATEWAY_URL", "http://user-backend:8000")
    combined_prompt = f"{system_prompt}\n\n{user_prompt}"
    url_fc = f"{base_url}/ollama_fc/{quote_plus(model)}/{quote_plus(combined_prompt)}"
    url_simple = f"{base_url}/ollama/{quote_plus(model)}/{quote_plus(combined_prompt)}"

    content = ""
    try:
        http_resp = requests.post(url_fc, timeout=60)
        if http_resp.status_code != 200:
            # Fallback to simple endpoint
            http_resp = requests.post(url_simple, timeout=60)
        try:
            data = http_resp.json()
            content = (
                (data.get("message", {}) or {}).get("content")
                or data.get("content")
                or data.get("text")
                or data.get("response")
                or http_resp.text
            )
        except Exception:
            content = http_resp.text
    except Exception as e:
        content = ""

    # Extract only valid SEVDO tokens using RAG service
    valid_tokens = rag_service.get_all_tokens()
    if valid_tokens:
        tokens = []
        words = content.split()
        for i, word in enumerate(words):
            clean_word = word.strip(".,!?()[]{}").lower()
            if clean_word in valid_tokens:
                # Context-aware filtering for ambiguous tokens
                if clean_word == "a":
                    # "a" is backend token (logout all) - block entirely in frontend contexts
                    if is_frontend:
                        continue
                    # Even in backend, only allow if it's clearly a logout-all context
                    if is_backend and not (
                        "logout" in subtask.lower()
                        and "all" in subtask.lower()
                    ):
                        continue

                # Extra validation for other single-letter tokens
                if len(clean_word) == 1 and clean_word != "a":
                    # Check context for other single letters
                    prev_word = words[i - 1].lower() if i > 0 else ""
                    next_word = (
                        words[i + 1].lower() if i < len(words) - 1 else ""
                    )

                    # Skip if surrounded by English context
                    if prev_word in [
                        "and",
                        "or",
                        "is",
                        "was",
                        "has",
                        "have",
                        "the",
                        "in",
                        "on",
                        "at",
                    ]:
                        if next_word in [
                            "system",
                            "way",
                            "method",
                            "form",
                            "page",
                            "website",
                            "component",
                            "element",
                        ]:
                            continue

                tokens.append(clean_word)

        # Remove excessive duplicates (max 2 same tokens in a row)
        final_tokens = []
        prev_token = None
        count = 0
        for token in tokens:
            if token == prev_token:
                count += 1
                if count < 3:  # Max 2 in a row
                    final_tokens.append(token)
            else:
                final_tokens.append(token)
                count = 1
            prev_token = token

        content = (
            " ".join(final_tokens[:8]) if final_tokens else content.strip()
        )
    else:
        content = content.strip()

    # Emergency fallback: if we extracted no clean tokens, extract from any SEVDO patterns
    if not final_tokens:
        # Look for token patterns in the full output (markdown lists, mentions, etc.)
        emergency_tokens = []
        for token in valid_tokens:
            if token in content.lower():
                emergency_tokens.append(token)
        if emergency_tokens:
            content = " ".join(emergency_tokens[:5])
        else:
            # Last resort: suggest tokens based on subtask
            fallback_tokens = []
            if "login" in subtask.lower():
                fallback_tokens.extend(["lf", "i", "b"])
            elif "form" in subtask.lower():
                fallback_tokens.extend(["i", "b"])
            elif "button" in subtask.lower():
                fallback_tokens.append("b")
            elif "input" in subtask.lower():
                fallback_tokens.append("i")

            if fallback_tokens:
                content = " ".join(fallback_tokens[:3])

    print("""THE CODING AGENT OUTPUT: """, content)

    # Attempt to compile tokens to actual code
    compilation_result = compile_tokens(content.strip(), is_frontend)

    return {
        "subtask": subtask,
        "output": content.strip(),
        "model": model,
        "compilation": compilation_result,
        "context": {"frontend": is_frontend, "backend": is_backend},
    }

if __name__ == "__main__":
    subtask = "login system"
    rag_service = AgentRAGService()
    model = "gpt-oss:20b"
    solve_subtask(subtask, rag_service, model)