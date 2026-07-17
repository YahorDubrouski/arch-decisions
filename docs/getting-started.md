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
| Express API | http://localhost:3001 |
| Python API | http://localhost:3002 |

```bash
make docker-down
```

Copy env templates before first run if missing:

- root `.env.example` → `.env` (`REDIS_URL`, `POSTGRES_PASSWORD`, … used by Compose)
- `backend/.env.example` → `backend/.env`
- `backend-python/.env.example` → `backend-python/.env`

Point the frontend at Python by setting `VITE_API_URL=http://localhost:3002` (Compose frontend service env or `frontend/.env`).

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
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend-python pytest
```

---

## Verify provider combinations

Confirms backend mock/template/openai paths and fail-loud rules (live OpenAI when `OPENAI_API_KEY` is set):

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend npm run verify:providers
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend-python python scripts/verify_provider_matrix.py
```

Matrix explained in [architecture.md](./architecture.md#provider-configuration).

---

## Migrations

**Express (SQLite):** see commands below.  
**Python (PostgreSQL):** Alembic runs on `backend-python` container start (`alembic upgrade head`).

### Express (SQLite)

Run automatically on API container start. Manual:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend npm run migrate
```

Use `STORAGE_PROVIDER=memory` for a stateless API (no DB file).
