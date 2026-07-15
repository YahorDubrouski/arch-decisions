# 🏗️ Architecture Decisions Platform (with AI support)

> A portfolio project demonstrating **architectural thinking**, **decision-making**, **trade-offs**, and **frontend
system design** using modern React best practices.

---

## 📋 Table of Contents

- [What Is This Project?](#-what-is-this-project)
- [Key Architecture Decisions](#-key-architecture-decisions)
- [Business Features](#business-features)
- [Full Example](#-full-example-context--decision--adr--ui-rendering)
- [Decision Rules Example](#-decision-rules-example)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Documentation](#-documentation)
- [Competencies Demonstrated](#-competencies-demonstrated)

---

## 🎯 What Is This Project?

The **Architecture Decisions Platform** helps engineers and architects choose the right infrastructure and tools for
their projects.

You input your project requirements (team size, budget, compliance needs), and the platform recommends architecture
decisions (like which cloud services to use) with explanations of why and what the trade-offs are.

### Business Features

1. **📝 Context Builder** - Multi-step form to capture project requirements (team size, budget, compliance, maturity)
2. **🤖 Decision Engine** - Evaluates context and recommends architecture decisions (Compute, Secrets, CI/CD) with
   alternatives and trade-offs
3. **📋 AI-Assisted ADR Generation** - Generates Architecture Decision Records explaining rationale, alternatives, and
   consequences

### What Is It Built For?

**Primary Purpose**: This is a **portfolio project** designed to demonstrate:

- **Architectural Competencies**: Systems thinking, decision-making under constraints, explicit trade-offs, business
  impact awareness
- **Frontend System Design**: React application architecture, state management strategy, separation of concerns,
  scalability patterns
- **Professional Communication**: Clear documentation, ADR format, explaining WHY not just HOW
- **Pragmatic Judgment**: Simplicity over overengineering, appropriate tool selection, production awareness

**Target Audience**:

- Solution/Platform Architects evaluating candidates
- Senior Engineering Managers hiring for architect roles
- Technical leads assessing architectural thinking

---

## 🎯 Key Architecture Decisions

This section highlights the most important architectural decisions and trade-offs, demonstrating architectural thinking
and judgment.

### Runtime: Node.js 24 Active LTS (Krypton)

**Decision**: Node.js 24 Active LTS over v25 (Current) or v22/v20 (Maintenance LTS)

**Rationale**:

- **Active LTS** provides stability + active development (best of both worlds)
- v25 (Current) is not LTS - shorter support window, less production-proven
- v22/v20 (Maintenance LTS) are maintenance-only, no new features

**Trade-off**: Choosing actively supported LTS over bleeding edge demonstrates pragmatic judgment and production
awareness.

### Storage: SQLite over JSON Files

**Decision**: SQLite (file-based database) over JSON files or PostgreSQL/MySQL

**Rationale**:

- More professional and demonstrates database knowledge
- Still simple (file-based, no separate server)
- PostgreSQL/MySQL would add unnecessary complexity (separate server) for portfolio project

**Trade-off**: Professional data management without infrastructure overhead.

### Docker Architecture: Separate Compose Files

**Decision**: Separate `docker-compose.yml` files for frontend/backend + root orchestrator

**Rationale**:

- Enables frontend and backend to be **separate repositories**
- Allows **separate teams** to work independently
- Root compose enables one-command setup (monorepo workflow)

**Trade-off**: Flexibility for both monorepo and separate repo strategies, demonstrating understanding of different team
structures.

### Frontend: React 18 over React 19

**Decision**: React 18 over React 19 (released Dec 2024)

**Rationale**:

- React 18 is battle-tested in production
- React 19 is very new, ecosystem may not fully support it yet
- Demonstrates pragmatic judgment (stability over bleeding edge)

**Trade-off**: Proven stability over latest features, consistent with Node.js LTS decision.

### State Management: Zustand/Context API over Redux

**Decision**: Zustand or Context API over Redux

**Rationale**:

- Redux adds unnecessary complexity for this project's needs
- Zustand/Context API demonstrate state management competency without overengineering
- Shows judgment: use simplest solution that demonstrates the competency

**Trade-off**: Simplicity and maintainability over tool mastery demonstration.

### Backend: Express.js over Nest.js/Fastify

**Decision**: Express.js over Nest.js, Fastify, or other frameworks

**Rationale**:

- Express is industry standard, widely understood
- Unopinionated - allows demonstration of service layer patterns
- Nest.js too opinionated, adds complexity without portfolio benefit

**Trade-off**: Flexibility to demonstrate architectural patterns vs. framework constraints.

---

## 📖 Full Example: Context → Decision → ADR → UI Rendering

### Step 1️⃣: Context Input (Feature 1)

**User inputs project context:**

```json
{
  "teamSize": "6-20",
  "traffic": "variable",
  "budget": "cost-optimized",
  "compliance": ["SOC2"],
  "maturity": "moderate"
}
```

**React demonstrates**: ✅ Form state modeling, validation, component composition

---

### Step 2️⃣: Decision Evaluation (Feature 2)

**Backend evaluates context and recommends:**

| Category        | Recommendation      | Rationale                              |
|-----------------|---------------------|----------------------------------------|
| 🖥️ **Compute** | ECS                 | Balanced cost/complexity for team size |
| 🔐 **Secrets**  | AWS Secrets Manager | SOC2 compliance requirement            |
| 🔄 **CI/CD**    | GitHub Actions      | Cost-optimized, fits team size         |

**React demonstrates**: ✅ Derived state, memoization, conditional rendering

---

### Step 3️⃣: AI-Generated ADR (Feature 4)

**AI generates Architecture Decision Record explaining:**

- Why ECS over EKS (team size, cost sensitivity)
- Why Secrets Manager (compliance requirement)
- Trade-offs and consequences

**React demonstrates**: ✅ Async orchestration, loading states, error handling

---

### Step 4️⃣: ADR Visualization (Feature 5)

**React renders ADR in summary/full views:**

- **Summary**: Key decision, rationale, trade-offs
- **Full**: Complete markdown document with context

**React demonstrates**: ✅ Component responsibility, performance-aware rendering

> **Architecture demonstrates**: Complete decision lifecycle from input to documentation

---

## 📋 Decision Rules Example

Decision rules are **hardcoded in TypeScript** (`backend/src/services/DecisionService.ts`) for type safety and
testability. Here's an example of what a decision rule structure looks like:

```json
{
  "category": "compute",
  "description": "Decision rules for compute infrastructure recommendations",
  "rules": [
    {
      "id": "compute-rule-1",
      "name": "Small team, cost-optimized",
      "conditions": {
        "teamSize": "1-5",
        "budgetSensitivity": "cost-optimized"
      },
      "recommendation": "EC2",
      "alternatives": ["ECS", "Lambda"],
      "tradeOffs": {
        "cost": "low",
        "complexity": "low",
        "risk": "low",
        "operationalOverhead": "medium"
      },
      "rationale": "EC2 provides maximum control with minimal cost for small teams. No container orchestration overhead."
    }
  ]
}
```

**Implementation Notes**:

- ✅ Rules are type-safe (TypeScript validation)
- ✅ Testable (unit tests)
- ✅ No runtime file I/O
- ✅ Version controlled with code

**Data Storage**:

- **Decision evaluation results**: Stored in SQLite database (`backend/data/decisions.db`)
- **ADRs**: Stored in SQLite database (`backend/data/decisions.db`)

## 📁 Project Structure

```
arch-decisions/
├── 📱 frontend/              # React application
│   ├── src/
│   │   ├── app/             # App wiring (router, providers); keeps main.tsx minimal
│   │   ├── pages/           # Route-level screens, thin (compose features) + co-located *.module.css
│   │   ├── features/        # Cohesive business features (one folder per user flow)
│   │   │   └── context/     # Context Builder feature
│   │   │       ├── components/  # Feature UI + co-located *.module.css + __tests__
│   │   │       ├── hooks/       # Feature state logic (e.g. useContextForm) + __tests__
│   │   │       └── services/    # Feature API calls (contextService)
│   │   ├── domain/          # Shared business types & pure rules (no React/HTTP)
│   │   ├── shared/          # Reusable cross-feature code
│   │   │   ├── api/         # Generic fetch wrapper (httpClient)
│   │   │   └── styles/      # Global design tokens + reset
│   │   └── test/           # Vitest setup (jest-dom matchers, DOM cleanup)
│   ├── docker-compose.yml   # Frontend standalone
│   └── Dockerfile
│
├── 🔧 backend/               # Node.js/Express backend
│   ├── src/
│   │   ├── app.ts           # Express app setup (middleware, routes)
│   │   ├── server.ts        # HTTP server bootstrap
│   │   ├── index.ts         # Entry point
│   │   ├── config/          # Environment and integration config
│   │   ├── routes/          # Route registration (thin)
│   │   ├── controllers/     # HTTP layer — parse request, call services, send response
│   │   ├── services/        # Business logic (service layer)
│   │   │   └── decisions/   # Decision evaluation + provider abstraction
│   │   ├── integrations/    # External systems (OpenAI provider, client, schemas)
│   │   ├── domain/          # Types, pure rules (trade-off calculator)
│   │   ├── validators/      # Zod schemas (HTTP request + response shapes)
│   │   └── lib/             # Cross-cutting utilities (logging)
│   ├── docker-compose.yml  # Backend standalone
│   └── Dockerfile
│
├── 📚 docs/                # Project documentation
│   └── examples/          # Example scenarios and ADRs
│       ├── scenarios/
│       ├── adrs/
│       └── flows/
│
└── 🐳 docker-compose.yml   # Root: orchestrates frontend + backend
```

### Frontend Structure: Why This Layout

The frontend uses a **hybrid feature-based structure** (feature folders + shared layer) — the layout most senior React teams ship in production. It scales past a single page without a costly refactor.

| Folder | What | Why |
|--------|------|-----|
| `app/` | Router and providers | One place for app wiring; `main.tsx` stays minimal |
| `pages/` | Route-level screens | Thin; only compose features, no heavy logic |
| `features/<name>/` | Everything for one user flow (components, hooks, services) | High cohesion — easy to grow, review, or delete a feature |
| `domain/` | Shared types & pure rules | Business logic with no React/HTTP, reusable across features |
| `shared/` | Generic building blocks (api, styles) | Avoids duplication across features |
| `test/` | Vitest setup | jest-dom matchers + DOM cleanup before each test |

**Styling:** global design tokens + reset in `shared/styles/`, everything else as co-located `*.module.css` (CSS Modules — locally scoped class names, no collisions).

**Data flow:** `pages/` → compose feature UI + hooks (`features/`) → call API (`features/*/services/` or `shared/api/`) → use types/rules (`domain/`).

### Backend Structure: Why This Layout

The backend follows **layered clean architecture**: thin HTTP layer, business logic in services, integrations isolated, domain kept pure.

| Folder | What | Why |
|--------|------|-----|
| `routes/` | Route wiring | Declares endpoints; delegates to controllers |
| `controllers/` | HTTP adapters | Parse/validate request, call services, map responses and status codes |
| `services/` | Business logic | Core use cases (e.g. `evaluate-decisions.service`); no Express types |
| `integrations/` | External I/O | OpenAI client/provider behind an abstraction — swappable for tests/mocks |
| `domain/` | Types & pure rules | Shared models and calculations with no framework dependencies |
| `validators/` | Zod schemas | Request/response validation at HTTP and integration boundaries |
| `config/` | App configuration | Env and third-party settings in one place |
| `src/migrations/` | Knex migrations | Versioned schema changes for SQLite (`npm run migrate`) |

**Data flow:** `routes/` → `controllers/` → `services/` → `integrations/` (when needed) + `domain/`

**Database migrations (Knex):** Schema is managed with industry-standard Knex migrations, not inline `CREATE TABLE` in app code. Migrations run automatically on server start when `STORAGE_PROVIDER=sqlite`, and can be run manually:

```bash
cd backend
npm run migrate           # apply pending migrations
npm run migrate:rollback  # rollback last migration
```

Use `STORAGE_PROVIDER=memory` for demo deploys (no database file, no migrations).

## 🛠️ Technology Stack

### Frontend

| Technology                  | Purpose                              |
|-----------------------------|--------------------------------------|
| ⚛️ **React 18**             | UI framework (functional components) |
| 📘 **TypeScript**           | Type safety and developer experience |
| ⚡ **Vite**                  | Fast build tool and dev server       |
| 🗃️ **Zustand/Context API** | State management                     |

### Backend

| Technology                   | Purpose             |
|------------------------------|---------------------|
| 🟢 **Node.js 24 Active LTS** | Runtime (Krypton)   |
| 🚀 **Express.js**            | Web framework       |
| 📘 **TypeScript**            | Type safety         |
| 💾 **SQLite**                | File-based database |
| 🧱 **Knex.js**               | SQL migrations      |

### Docker

| Setup                         | Purpose                      |
|-------------------------------|------------------------------|
| 📦 **Separate compose files** | Enables separate repos/teams |
| 🐳 **Root compose file**      | One-command setup (monorepo) |

## 🚀 Getting Started

### Prerequisites

- ✅ Node.js 24 Active LTS
- ✅ Docker and Docker Compose

### Development

#### Option 1: Monorepo (Root docker-compose) 🐳

```bash
docker-compose up
```

#### Option 2: Separate Services 🔀

```bash
# Frontend only
cd frontend && docker-compose up

# Backend only
cd backend && docker-compose up
```

#### Option 3: Manual Setup 🛠️

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) | API contracts, domain models, env vars |
| [docs/examples/](./docs/examples/) | Sample contexts, ADRs, full journey walkthrough |
| [docs/COMPETENCY_MAP.md](./docs/COMPETENCY_MAP.md) | Which features demonstrate which competencies |
| [README-FRONTEND.md](./README-FRONTEND.md) | Frontend-focused guide for React hiring reviewers |
| [checklist.md](./checklist.md) | Validated progress vs plan (done / deferred / intentional alternatives) |
| [ITERATION_PLAN.md](./ITERATION_PLAN.md) | Original iteration breakdown |

**Quick start for reviewers:** Read [full journey](./docs/examples/flows/full-journey.md) → try [startup scenario](./docs/examples/scenarios/startup-cost-optimized.json) in the UI.

## 🎯 Competencies Demonstrated

This project demonstrates **17 core competencies** across architecture and frontend system design. Each competency is
demonstrated through specific decisions, code patterns, and documentation.

### Architecture & Platform (1-10)

| #  | Competency                      | Demonstrated In                                                                                |
|----|---------------------------------|------------------------------------------------------------------------------------------------|
| 1  | 🏗️ **Architectural Thinking**  | [Key Architecture Decisions](#-key-architecture-decisions) - Systems, not tools                |
| 2  | ⚖️ **Decision-Making**          | [Key Architecture Decisions](#-key-architecture-decisions) - Under constraints                 |
| 3  | 📊 **Explicit Trade-offs**      | [Key Architecture Decisions](#-key-architecture-decisions) - Why NOT alternatives              |
| 4  | 💼 **Business Impact**          | [Key Architecture Decisions](#-key-architecture-decisions) - Cost, risk, operations            |
| 5  | 👤 **Ownership**                | [Key Architecture Decisions](#-key-architecture-decisions) - Responsibility for decisions      |
| 6  | 📝 **Structuring Requirements** | [Full Example](#-full-example-context--decision--adr--ui-rendering) - Context Builder          |
| 7  | ✍️ **Clear Communication**      | README, [Technical Spec](./TECHNICAL_SPEC.md), [Examples](./docs/examples/), [Competency map](./docs/COMPETENCY_MAP.md) |
| 8  | 🔧 **Pragmatic DevOps**         | Docker architecture, deployment strategy                                                       |
| 9  | 🤖 **AI Integration**           | AI-assisted ADR generation (decision-support, not hype)                                        |
| 10 | 📋 **ADR**                      | [Full Example](#-full-example-context--decision--adr--ui-rendering) - ADR generation & viewing |

### Frontend / React (11-17)

| #  | Competency                    | Demonstrated In                                                                              |
|----|-------------------------------|----------------------------------------------------------------------------------------------|
| 11 | ⚛️ **React Architecture**     | [Project Structure](#-project-structure) - Application structure, not just components        |
| 12 | 🗃️ **State Management**      | State management strategy (Zustand/Context) - [Key Decisions](#-key-architecture-decisions)  |
| 13 | 🧩 **Separation of Concerns** | [Project Structure](#-project-structure) - Domain/UI/Infrastructure boundaries               |
| 14 | 🔄 **Async Orchestration**    | [Full Example](#-full-example-context--decision--adr--ui-rendering) - Data fetching patterns |
| 15 | 📈 **Scalability**            | Frontend codebase maintainability patterns                                                   |
| 16 | ⚡ **Performance Patterns**    | Memoization, code splitting, rendering optimization                                          |
| 17 | 💡 **Clear Reasoning**        | [Key Architecture Decisions](#-key-architecture-decisions) - WHY patterns were chosen        |

> See [docs/COMPETENCY_MAP.md](./docs/COMPETENCY_MAP.md) and [ITERATION_PLAN.md](./ITERATION_PLAN.md) for detailed competency mapping per feature.

---

## 📄 License

This is a portfolio project for demonstration purposes.

---


