# Getting started

## Docker (recommended)

From the repo root:

```bash
make docker-up
```

Uses `docker-compose.yml` + `docker-compose.dev.yml` (hot reload for frontend and API).

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5174 |
| API | http://localhost:3001 |

```bash
make docker-down
```

Copy `backend/.env.example` to `backend/.env` before first run if the file is missing.

---

## Manual run (without Docker)

**Backend**

```bash
cd backend && npm install && npm run dev
```

Requires Redis for async jobs (`REDIS_URL`, default in `.env.example`).

**Worker** (separate terminal):

```bash
cd backend && npm run worker:dev
```

**Frontend**

```bash
cd frontend && npm install && npm run dev
```

---

## Frontend-only demo

Set `VITE_DATA_SOURCE=local` (Compose env or `frontend/.env`). No API or OpenAI required — rules and templates run in the browser with `sessionStorage`.

---

## Tests

Inside running containers:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T frontend npm run test
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend npm run test
```

---

## Verify provider combinations

Confirms backend mock/template/openai paths and fail-loud rules (live OpenAI when `OPENAI_API_KEY` is set):

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend npm run verify:providers
```

Matrix explained in [architecture.md](./architecture.md#provider-configuration).

---

## Migrations (SQLite)

Run automatically on API container start. Manual:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend npm run migrate
```

Use `STORAGE_PROVIDER=memory` for a stateless API (no DB file).
