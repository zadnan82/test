# sevdo_backend/endpoints.py
import os
import importlib
from pathlib import Path

# Dictionary to store loaded endpoint modules
_endpoint_modules = {}


def load_all_endpoints():
    """Load all endpoint modules from the endpoints directory."""
    endpoints_dir = Path(__file__).parent / "endpoints"

    if not endpoints_dir.exists():
        return

    for file_path in endpoints_dir.glob("*.py"):
        if file_path.name.startswith("_"):
            continue

        try:
            module_name = file_path.stem
            spec = importlib.util.spec_from_file_location(module_name, file_path)
            if spec and spec.loader:
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)

                # Register the module if it has the required attributes
                if hasattr(module, "ENDPOINT_TOKEN"):
                    _endpoint_modules[module.ENDPOINT_TOKEN] = module

        except Exception as e:
            print(f"Failed to load endpoint {file_path.name}: {e}")


def get_endpoint_module(token):
    """Get endpoint module by token."""
    return _endpoint_modules.get(token)


def list_available_tokens():
    """List all available endpoint tokens."""
    return list(_endpoint_modules.keys())
