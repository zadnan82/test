import importlib
import httpx
import pytest


def _get_app():
	mod = importlib.import_module("sevdo_frontend.frontend_compiler")
	mod = importlib.reload(mod)
	return mod.app


@pytest.mark.anyio
async def test_fe_to_s_and_from_s(tmp_path):
	app = _get_app()
	transport = httpx.ASGITransport(app=app)
	async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
		inp = tmp_path / "in.dsl"
		out = tmp_path / "out.jsx"
		inp.write_text("\n".join([
			"h(Title)",
			"t(Welcome)",
			"i(email,label=Email)",
			"b(Go){onClick=go}",
			"c{class=mt-2}",
		]), encoding="utf-8")

		resp = await client.post("/api/fe-translate/to-s", json={
			"input_path": str(inp),
			"output_path": str(out),
			"include_imports": True,
			"component_name": "MyPage",
		})
		assert resp.status_code == 200, resp.text
		data = resp.json()
		assert data["written_to"] == str(out)
		assert data["bytes"] > 0

		jsx = out.read_text(encoding="utf-8")
		assert "import React from 'react';" in jsx
		assert "export default function MyPage()" in jsx
		assert "<h1>Title</h1>" in jsx
		assert "<p>Welcome</p>" in jsx
		assert "placeholder=\"email\"" in jsx
		assert "onClick={go}" in jsx

		resp2 = await client.post("/api/fe-translate/from-s", json={
			"code_path": str(out)
		})
		assert resp2.status_code == 200, resp2.text
		data2 = resp2.json()
		for tk in ["h", "t", "i", "b"]:
			assert tk in data2["tokens"]


@pytest.mark.anyio
async def test_fe_batch_endpoints(tmp_path):
	app = _get_app()
	transport = httpx.ASGITransport(app=app)
	async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
		# Inputs
		i1 = tmp_path / "a.dsl"
		i1.write_text("h(A)\nt(B)\n", encoding="utf-8")
		i2 = tmp_path / "b.dsl"
		i2.write_text("c(h(C))\n", encoding="utf-8")
		o1 = tmp_path / "a.jsx"
		o2 = tmp_path / "b.jsx"

		resp = await client.post("/api/fe-translate/to-s-batch", json={
			"jobs": [
				{"id": "a1", "input_path": str(i1), "output_path": str(o1), "include_imports": True, "component_name": "A"},
				{"id": "b2", "input_path": str(i2), "output_path": str(o2), "include_imports": False}
			]
		})
		assert resp.status_code == 200, resp.text
		body = resp.json()
		assert body["totals"]["ok"] == 2
		ids = {r["id"] for r in body["results"]}
		assert ids == {"a1", "b2"}

		resp2 = await client.post("/api/fe-translate/from-s-batch", json={
			"jobs": [
				{"id": "a1", "code_path": str(o1)},
				{"id": "b2", "code_path": str(o2)}
			]
		})
		assert resp2.status_code == 200, resp2.text
		body2 = resp2.json()
		ids2 = {r["id"] for r in body2["results"]}
		assert ids2 == {"a1", "b2"}


@pytest.mark.anyio
async def test_fe_cache_stats_and_flush(tmp_path):
	app = _get_app()
	transport = httpx.ASGITransport(app=app)
	async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
		await client.post("/api/fe-cache/flush")

		inp = tmp_path / "in.dsl"
		out = tmp_path / "out.jsx"
		inp.write_text("h(Title)\n", encoding="utf-8")
		await client.post("/api/fe-translate/to-s", json={
			"input_path": str(inp),
			"output_path": str(out),
			"include_imports": True,
			"use_cache": True,
		})
		await client.post("/api/fe-translate/from-s", json={
			"code_path": str(out),
			"use_cache": True,
		})

		stats = await client.get("/api/fe-cache/stats")
		assert stats.status_code == 200
		s = stats.json()
		assert s["dsl_to_jsx"]["size"] >= 1
		assert s["jsx_to_dsl"]["size"] >= 1

		flushed = await client.post("/api/fe-cache/flush")
		assert flushed.status_code == 200
		stats2 = await client.get("/api/fe-cache/stats")
		assert stats2.status_code == 200
		s2 = stats2.json()
		assert s2["dsl_to_jsx"]["size"] == 0
		assert s2["jsx_to_dsl"]["size"] == 0


@pytest.mark.anyio
async def test_fe_errors_404_and_413(tmp_path, monkeypatch):
	app = _get_app()
	transport = httpx.ASGITransport(app=app)
	async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
		# 404
		resp = await client.post("/api/fe-translate/to-s", json={
			"input_path": str(tmp_path / "missing.dsl"),
			"output_path": str(tmp_path / "x.jsx"),
			"include_imports": True,
		})
		assert resp.status_code == 404

		# 413
		big = tmp_path / "big.dsl"
		big.write_text("x" * 4096, encoding="utf-8")
		monkeypatch.setenv("TRANSLATE_MAX_FILE_BYTES", "100")
		importlib.invalidate_caches()
		# Rebuild app with new env
		app2 = _get_app()
		transport2 = httpx.ASGITransport(app=app2)
		async with httpx.AsyncClient(transport=transport2, base_url="http://testserver") as client2:
			resp2 = await client2.post("/api/fe-translate/to-s", json={
				"input_path": str(big),
				"output_path": str(tmp_path / "big.jsx"),
				"include_imports": False,
			})
			assert resp2.status_code == 413


@pytest.mark.anyio
async def test_fe_nesting_render(tmp_path):
	app = _get_app()
	transport = httpx.ASGITransport(app=app)
	async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
		inp = tmp_path / "nest.dsl"
		out = tmp_path / "nest.jsx"
		inp.write_text(
			"\n".join([
				"c(",
				"  h(Welcome)",
				"  c(t(Inner)){class=mt-4}",
				"  f(i(name,label=Name) b(Save){onClick=save})",
				")",
			]),
			encoding="utf-8",
		)
		resp = await client.post("/api/fe-translate/to-s", json={
			"input_path": str(inp),
			"output_path": str(out),
			"include_imports": False,
		})
		assert resp.status_code == 200, resp.text
		jsx = out.read_text(encoding="utf-8")
		assert "<div className=\"flex flex-col gap-4\">" in jsx
		assert "<h1>Welcome</h1>" in jsx
		assert "<p>Inner</p>" in jsx
		assert "<form>" in jsx
		assert "onClick={save}" in jsx

