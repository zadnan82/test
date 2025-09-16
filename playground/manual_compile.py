#!/usr/bin/env python3
"""
Manual compilation script for testing.
"""
import sys
from pathlib import Path

# Add the parent directory to the path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from sevdo_frontend.frontend_compiler import dsl_to_jsx, load_prefabs

def compile_file(input_file, output_file):
    load_prefabs()
    
    input_path = Path(__file__).parent / "input_files" / input_file
    output_path = Path(__file__).parent / "output_files" / output_file
    
    if not input_path.exists():
        print(f"Input file not found: {input_path}")
        return
    
    content = input_path.read_text(encoding='utf-8')
    jsx = dsl_to_jsx(content, component_name=f"{input_file.replace('.txt', '').title()}Component")
    
    output_path.write_text(jsx, encoding='utf-8')
    print(f"Compiled {input_file} -> {output_file}")
    print(f"Output size: {len(jsx)} characters")
    print(f"Has inline styles: {'style=' in jsx}")
    print(f"Has blue background: {'background-color: #bfdbfe' in jsx}")

if __name__ == "__main__":
    compile_file("blue_login.txt", "blue_login.jsx")
