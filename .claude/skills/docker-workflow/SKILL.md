---
name: docker-workflow
description: >
  Runs arch-decisions npm, tests, lint, and installs inside Docker. Use when
  installing packages, running tests, linting, formatting, or starting the
  dev stack. Do not run npm or node on the host.
---

# Docker-first workflow

Package management, tests, lint, and format for frontend and backend run inside containers, not on the host.

## 1. Ensure the stack is up

From the repo root, before any npm or node command:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml ps -q
```

If no containers are running (empty output):

```bash
make docker-up
```

Wait until both `frontend` and `backend` services are up.

## 2. Run commands via docker-compose exec

Use service names, not container IDs.

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec backend npm run test
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec backend npm install
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec backend npm run lint

docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec frontend npm run test
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec frontend npm install
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec frontend npm run lint
```

Add `-T` for non-interactive runs: `exec -T backend npm run test`.

Equivalent container names if needed: `arch-decisions_backend_1`, `arch-decisions_frontend_1`.

## 3. Do not run on the host

Do not run `cd frontend && npm test`, `cd backend && npm install`, `npx vitest`, `npx jest`, or `npm run dev` on the host.

Dev servers are already started by `make docker-up` (Vite on `:5174`, API on `:3001`).

## 4. Stop the stack

```bash
make docker-down
```
