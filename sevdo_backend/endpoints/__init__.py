# sevdo_backend/endpoints/__init__.py
"""
Backend endpoints for SEVDO system.
Each endpoint file defines a render_endpoint function that returns FastAPI endpoint code.
"""

import os
from pathlib import Path

# Global registry of all available endpoints
ENDPOINT_REGISTRY = {}


def register_endpoint(token, module_name):
    """Register an endpoint with its token."""
    ENDPOINT_REGISTRY[token] = module_name


def load_all_endpoints():
    """Load all endpoint modules and register them."""
    endpoints_dir = Path(__file__).parent

    for file_path in endpoints_dir.glob("*.py"):
        if file_path.name.startswith("__"):
            continue

        module_name = file_path.stem
        try:
            # Import the module
            module = __import__(f"endpoints.{module_name}", fromlist=[module_name])

            # Check if module has required attributes
            if hasattr(module, "ENDPOINT_TOKEN") and hasattr(module, "render_endpoint"):
                token = module.ENDPOINT_TOKEN
                ENDPOINT_REGISTRY[token] = module
                print(f"Registered endpoint: {token} -> {module_name}")
            else:
                print(
                    f"Warning: {module_name} missing ENDPOINT_TOKEN or render_endpoint"
                )

        except Exception as e:
            print(f"Error loading endpoint {module_name}: {e}")


def get_endpoint_module(token):
    """Get endpoint module by token."""
    return ENDPOINT_REGISTRY.get(token)


def list_available_tokens():
    """List all available endpoint tokens."""
    return list(ENDPOINT_REGISTRY.keys())
