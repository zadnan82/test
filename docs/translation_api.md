## Translation API

Service for translating shorthand tokens (e.g., `l`, `r`, `m`) to generated FastAPI code and back.

Base URL: `/api/translate`

### Run locally

```bash
uvicorn sevdo_backend.backend_compiler:app --reload
```

Interactive docs: `/docs` and `/redoc`.

### Environment variables

- `TRANSLATE_MAX_FILE_BYTES` (default: 1048576) — max file size for reads (413 if exceeded)
- `TRANSLATE_BATCH_MAX_WORKERS` (default: 4) — batch concurrency
- `TRANSLATE_CACHE_TTL_SECONDS` (default: 1800) — in-memory cache TTL
- `TRANSLATE_CACHE_MAXSIZE` (default: 256) — in-memory cache size

---

## POST /api/translate/to-s

Translate tokens (read from file) to code (written to file).

Request body:

```json
{
  "input_path": "sevdo_backend/input.txt",
  "output_path": "sevdo_backend/output.py",
  "include_imports": true
}
```

Response 200:

```json
{
  "written_to": "sevdo_backend/output.py",
  "tokens": ["r", "l", "m"],
  "bytes": 1234,
  "changed": true
}
```

Errors:
- 404 `{ "code": "file_not_found", "path": "..." }` or `{ "code": "output_dir_not_found", "path": "..." }`
- 413 `{ "code": "file_too_large", "bytes": 9999, "limit": 1024 }`
- 400 `{ "code": "unknown_tokens", "unknown": ["x", "y"] }` or `{ "code": "file_read_error" | "file_write_error" | "unexpected_error" }`

Example:

```bash
curl -X POST http://127.0.0.1:8000/api/translate/to-s \
  -H "Content-Type: application/json" \
  -d '{"input_path":"sevdo_backend/input.txt","output_path":"sevdo_backend/output.py","include_imports":true}'
```

---

## POST /api/translate/from-s

Extract tokens from a generated code file.

Request body:

```json
{ "code_path": "sevdo_backend/output.py" }
```

Response 200:

```json
{ "tokens": ["r", "l", "m"] }
```

Errors:
- 404 `{ "code": "file_not_found", "path": "..." }`
- 413 `{ "code": "file_too_large", ... }`
- 400 `{ "code": "invalid_code_format", "message": "No recognizable endpoints found" }`

Example:

```bash
curl -X POST http://127.0.0.1:8000/api/translate/from-s \
  -H "Content-Type: application/json" \
  -d '{"code_path":"sevdo_backend/output.py"}'
```

---

## POST /api/translate/to-s-batch

Batch translate multiple token files to code.

Request body:

```json
{
  "jobs": [
    { "id": "a1", "input_path": "a.txt", "output_path": "a.py", "include_imports": true },
    { "id": "b2", "input_path": "b.txt", "output_path": "b.py", "include_imports": false }
  ]
}
```

Response 200:

```json
{
  "results": [
    { "id": "a1", "written_to": "a.py", "tokens": ["r","l"], "bytes": 456, "changed": true },
    { "id": "b2", "written_to": "b.py", "tokens": ["r","u"], "bytes": 321, "changed": false }
  ],
  "totals": { "ok": 2, "failed": 0 }
}
```

Per-job errors embed status and error object:

```json
{ "id": "b3", "status": 404, "error": { "code": "file_not_found", "path": "..." } }
```

---

## POST /api/translate/from-s-batch

Batch extract tokens from multiple code files.

Request body:

```json
{ "jobs": [ { "id": "a1", "code_path": "a.py" }, { "id": "b2", "code_path": "b.py" } ] }
```

Response 200:

```json
{
  "results": [ { "id": "a1", "tokens": ["r","l"] }, { "id": "b2", "tokens": ["r","u"] } ],
  "totals": { "ok": 2, "failed": 0 }
}
```

Per-job errors use the same shape as the to-s-batch endpoint.

---

## Notes

- Responses use ORJSON; Content-Type is `application/json`.
- Service caches translations in-memory; identical requests may be faster.
- Token set currently supported is defined in `sevdo_backend/backend_compiler.py` (`mapping`).

