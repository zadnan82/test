## Test suite overview

This suite verifies the Backend Compiler core behavior and its FastAPI endpoints for translating shorthand tokens (e.g., `l`, `r`) to generated code and back.

### What is covered

- Core translation

  - `test_round_trip_tokens_to_code_and_back`: Asserts a round-trip of tokens → code → tokens preserves order and content.
  - `test_write_if_changed`: Ensures file writes are skipped when content is unchanged and reported as changed only when content differs.

- API (single-item)

  - `POST /api/translate/to-s`: Reads tokens from an input file, emits generated code to an output path, returns metadata (bytes, changed).
  - `POST /api/translate/from-s`: Reads code from a file and extracts ordered tokens.
  - `test_to_s_and_from_s`: End-to-end flow using a temp input file; verifies response shapes and expected tokens.

- API (batch)

  - `POST /api/translate/to-s-batch`: Translates multiple input files to code concurrently, returns per-job status and totals.
  - `POST /api/translate/from-s-batch`: Extracts tokens from multiple code files, returns per-job status and totals.
  - `test_batch_endpoints`: Validates both batch routes succeed and correlate results by job `id`.

- Error handling
  - `test_errors_404_and_413`: Verifies 404 for missing input files and 413 when exceeding the `TRANSLATE_MAX_FILE_BYTES` limit.
  - `test_error_unknown_tokens`: Ensures 400 is returned for unknown tokens with a structured error payload.

### Test support files

- `tests/conftest.py`: Adds the repository root to `sys.path` so `sevdo_backend` imports work without packaging the project.

### How to run

1. Activate the project’s virtual environment.
2. Install dependencies (ideally via pip-tools or requirements lock).
3. Run:

```
pytest -q
```

### Notes

- Tests use `tmp_path` to isolate file I/O within a temporary directory per test.
- Size-limit tests temporarily override `TRANSLATE_MAX_FILE_BYTES` via `monkeypatch` and re-import the module.
- The app defaults to ORJSON responses; tests use FastAPI’s `TestClient` to exercise endpoints.
