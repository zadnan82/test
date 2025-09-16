import importlib
from fastapi.testclient import TestClient


def get_client():
    # Reload the module so env-based constants (e.g., file size limits) reflect current test env
    mod = importlib.import_module("sevdo_backend.backend_compiler")
    mod = importlib.reload(mod)
    return TestClient(mod.app)


def test_to_s_and_from_s(tmp_path, monkeypatch):
    client = get_client()
    inp = tmp_path / "in.txt"
    out = tmp_path / "out.py"
    inp.write_text("r l m\n", encoding="utf-8")

    # to-s
    resp = client.post(
        "/api/translate/to-s",
        json={
            "input_path": str(inp),
            "output_path": str(out),
            "include_imports": True,
        },
    )
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["written_to"] == str(out)
    assert data["tokens"] == ["r", "l", "m"]
    assert data["bytes"] > 0

    # from-s
    resp2 = client.post("/api/translate/from-s", json={"code_path": str(out)})
    assert resp2.status_code == 200, resp2.text
    data2 = resp2.json()
    assert data2["tokens"] == ["r", "l", "m"]


def test_batch_endpoints(tmp_path):
    client = get_client()
    in1 = tmp_path / "a.txt"
    in1.write_text("r l\n", encoding="utf-8")
    in2 = tmp_path / "b.txt"
    in2.write_text("r u\n", encoding="utf-8")
    out1 = tmp_path / "a.py"
    out2 = tmp_path / "b.py"

    resp = client.post(
        "/api/translate/to-s-batch",
        json={
            "jobs": [
                {
                    "id": "a1",
                    "input_path": str(in1),
                    "output_path": str(out1),
                    "include_imports": True,
                },
                {
                    "id": "b2",
                    "input_path": str(in2),
                    "output_path": str(out2),
                    "include_imports": False,
                },
            ]
        },
    )
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["totals"]["ok"] == 2
    assert {r["id"] for r in body["results"]} == {"a1", "b2"}

    resp2 = client.post(
        "/api/translate/from-s-batch",
        json={
            "jobs": [
                {"id": "a1", "code_path": str(out1)},
                {"id": "b2", "code_path": str(out2)},
            ]
        },
    )
    assert resp2.status_code == 200, resp2.text
    body2 = resp2.json()
    ids = {r["id"] for r in body2["results"]}
    assert ids == {"a1", "b2"}


def test_errors_404_and_413(tmp_path, monkeypatch):
    client = get_client()

    # 404 missing input file
    resp = client.post(
        "/api/translate/to-s",
        json={
            "input_path": str(tmp_path / "missing.txt"),
            "output_path": str(tmp_path / "x.py"),
            "include_imports": True,
        },
    )
    assert resp.status_code == 404

    # 413 oversized file
    big = tmp_path / "big.txt"
    big.write_text("x" * 2048, encoding="utf-8")
    monkeypatch.setenv("TRANSLATE_MAX_FILE_BYTES", "100")
    # re-import to pick up env in this process; client rebuild
    importlib.invalidate_caches()
    mod = importlib.reload(importlib.import_module("sevdo_backend.backend_compiler"))
    client = TestClient(mod.app)

    resp2 = client.post(
        "/api/translate/to-s",
        json={
            "input_path": str(big),
            "output_path": str(tmp_path / "big.py"),
            "include_imports": False,
        },
    )
    assert resp2.status_code == 413


def test_error_unknown_tokens(tmp_path):
    client = get_client()
    bad = tmp_path / "bad.txt"
    bad.write_text("r z q\n", encoding="utf-8")
    resp = client.post(
        "/api/translate/to-s",
        json={
            "input_path": str(bad),
            "output_path": str(tmp_path / "bad.py"),
            "include_imports": True,
        },
    )
    assert resp.status_code == 400
    body = resp.json()
    assert body["detail"]["code"] == "unknown_tokens"


def test_caching_hits_to_s_and_from_s(tmp_path):
    client = get_client()
    # Ensure a clean cache state
    client.post("/api/cache/flush")

    inp = tmp_path / "in.txt"
    out = tmp_path / "out.py"
    inp.write_text("r l m\n", encoding="utf-8")

    # First compile should be a cache miss
    resp1 = client.post(
        "/api/translate/to-s",
        json={
            "input_path": str(inp),
            "output_path": str(out),
            "include_imports": True,
            "use_cache": True,
        },
    )
    assert resp1.status_code == 200, resp1.text
    data1 = resp1.json()
    assert data1["cache"]["hit"] is False
    key1 = data1["cache"]["key"]

    # Second compile with identical input should be a cache hit
    resp2 = client.post(
        "/api/translate/to-s",
        json={
            "input_path": str(inp),
            "output_path": str(out),
            "include_imports": True,
            "use_cache": True,
        },
    )
    assert resp2.status_code == 200, resp2.text
    data2 = resp2.json()
    assert data2["cache"]["hit"] is True
    assert data2["cache"]["key"] == key1

    # Decompile twice: first miss, then hit
    resp3 = client.post(
        "/api/translate/from-s",
        json={
            "code_path": str(out),
            "use_cache": True,
        },
    )
    assert resp3.status_code == 200, resp3.text
    d3 = resp3.json()
    assert d3["cache"]["hit"] is False
    key_code_1 = d3["cache"]["key"]

    resp4 = client.post(
        "/api/translate/from-s",
        json={
            "code_path": str(out),
            "use_cache": True,
        },
    )
    assert resp4.status_code == 200, resp4.text
    d4 = resp4.json()
    assert d4["cache"]["hit"] is True
    assert d4["cache"]["key"] == key_code_1


def test_cache_stats_and_flush(tmp_path):
    client = get_client()
    client.post("/api/cache/flush")

    # Populate caches
    inp = tmp_path / "in2.txt"
    out = tmp_path / "out2.py"
    inp.write_text("r l\n", encoding="utf-8")
    client.post(
        "/api/translate/to-s",
        json={
            "input_path": str(inp),
            "output_path": str(out),
            "include_imports": True,
            "use_cache": True,
        },
    )
    client.post(
        "/api/translate/from-s",
        json={
            "code_path": str(out),
            "use_cache": True,
        },
    )

    stats = client.get("/api/cache/stats")
    assert stats.status_code == 200, stats.text
    s = stats.json()
    assert s["tokens_to_code"]["size"] >= 1
    assert s["code_to_tokens"]["size"] >= 1

    flushed = client.post("/api/cache/flush")
    assert flushed.status_code == 200
    stats2 = client.get("/api/cache/stats")
    assert stats2.status_code == 200
    s2 = stats2.json()
    assert s2["tokens_to_code"]["size"] == 0
    assert s2["code_to_tokens"]["size"] == 0


def test_disable_cache_flag_results_in_misses(tmp_path):
    client = get_client()
    client.post("/api/cache/flush")

    inp = tmp_path / "in3.txt"
    out = tmp_path / "out3.py"
    inp.write_text("r u\n", encoding="utf-8")

    r1 = client.post(
        "/api/translate/to-s",
        json={
            "input_path": str(inp),
            "output_path": str(out),
            "include_imports": False,
            "use_cache": False,
        },
    )
    assert r1.status_code == 200
    assert r1.json()["cache"]["hit"] is False

    r2 = client.post(
        "/api/translate/to-s",
        json={
            "input_path": str(inp),
            "output_path": str(out),
            "include_imports": False,
            "use_cache": False,
        },
    )
    assert r2.status_code == 200
    assert r2.json()["cache"]["hit"] is False
