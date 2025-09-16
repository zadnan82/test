import sys
from pathlib import Path
import pytest


# Ensure repository root is on sys.path so `sevdo_backend` can be imported
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
	sys.path.insert(0, str(ROOT))


@pytest.fixture
def anyio_backend():
	# Force asyncio backend to avoid trio import issues on Windows/Py312
	return "asyncio"
