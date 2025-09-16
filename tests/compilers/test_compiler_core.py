import importlib


def test_round_trip_tokens_to_code_and_back():
    mod = importlib.import_module("sevdo_backend.backend_compiler")
    compiler = mod.BackendCompiler()
    tokens = ["r", "l", "m"]
    code = compiler.tokens_to_code(tokens, include_imports=True)
    round_trip = compiler.code_to_tokens(code)
    assert round_trip == tokens


def test_write_if_changed(tmp_path):
    mod = importlib.import_module("sevdo_backend.backend_compiler")
    out = tmp_path / "out.py"
    content1 = "print('a')\n"
    # First write should report changed True
    changed1 = mod._write_if_changed(str(out), content1)
    assert changed1 is True
    # Second write with same content should be False
    changed2 = mod._write_if_changed(str(out), content1)
    assert changed2 is False
    # Different content should be True again
    changed3 = mod._write_if_changed(str(out), "print('b')\n")
    assert changed3 is True
