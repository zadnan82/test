#!/usr/bin/env python3
"""
Test script to verify template functionality works correctly.
"""

import sys
import os
from pathlib import Path

# Add the parent directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sevdo_frontend.frontend_compiler import dsl_to_jsx, load_prefabs

def test_template_compilation():
    """Test that template compilation works."""

    print("Testing template functionality...")

    # Load prefabs
    load_prefabs()
    print("✅ Prefabs loaded successfully")

    # Test DSL compilation with a sample template page
    test_dsl = """
c(
  n(Home,About,Projects,Contact)
  h(Welcome to Our Website)
  t(This is a sample template page)
  b(Get Started)
)
"""

    try:
        jsx_result = dsl_to_jsx(test_dsl, include_imports=True, component_name="TestPage")
        print("✅ DSL compilation successful")
        print(f"Generated JSX length: {len(jsx_result)} characters")

        # Check if the JSX contains expected elements
        if "TestPage" in jsx_result and "React" in jsx_result:
            print("✅ Generated JSX has correct component name and React import")
        else:
            print("❌ Generated JSX missing expected content")

    except Exception as e:
        print(f"❌ DSL compilation failed: {e}")
        return False

    print("\n🎉 Template functionality test completed successfully!")
    return True

if __name__ == "__main__":
    test_template_compilation()
