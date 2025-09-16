"""
Example target file for dashboard/Aider testing.

How to test from the dashboard:
- WORKDIR: /app
- Files: sandbox/example_target.py
- Task: e.g., "Change greet() to return greeting in uppercase" or
         "Add type hints and a new function multiply(a, b)".

Safe to modify freely.
"""

from datetime import datetime


def greet(name: str) -> str:
    """Return a friendly greeting string."""
    return f"Hello, {name}!"


def add(a: int, b: int) -> int:
    """Return the sum of two integers."""
    return a + b


def current_timestamp() -> str:
    """Return an ISO8601 timestamp string (UTC naive)."""
    return datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S")


if __name__ == "__main__":
    # Demo output
    print(greet("World"))
    print("2 + 3 =", add(2, 3))
    print("Now:", current_timestamp())


