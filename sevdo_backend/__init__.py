"""sevdo_backend package.

This package exposes optional modules when present. Avoid hard failures
on import if optional submodules are missing in certain environments.
"""

try:  # Optional
	from .parser import parse_document, Endpoint, EndpointAction  # noqa: F401
except Exception:  # pragma: no cover - optional dependency
	pass

try:  # Optional
	from .transpiler import generate_route_handlers, generate_express_app  # noqa: F401
except Exception:  # pragma: no cover - optional dependency
	pass
