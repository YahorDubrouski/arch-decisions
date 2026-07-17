# Full journey: context → recommendations → ADR

Walkthrough aligned with the UI. Screenshots: [../screenshots/](../screenshots/).

## 1. Context (`/context`)

Example payload: [startup-cost-optimized.json](../scenarios/startup-cost-optimized.json)

```json
{
  "teamSize": "1-5",
  "trafficPattern": "low-steady",
  "budgetSensitivity": "cost-optimized",
  "complianceRequirements": [],
  "operationalMaturity": "minimal"
}
```

Submit enqueues evaluation (HTTP mode) or runs local rules (`VITE_DATA_SOURCE=local`). Context and recommendations stay in the session for the next routes.

## 2. Recommendations (`/recommendations`)

Typical output for the startup scenario:

| Category | Recommended | Rationale |
|----------|-------------|-----------|
| Compute | EC2 | Small team + cost focus |
| Secrets | AWS Parameter Store | No compliance mandate |
| CI/CD | GitHub Actions | Low setup cost |

## 3. Generate ADR

Action: **Generate architecture decision** on `/recommendations`.

`POST /api/architecture-decisions/generate` with `{ context, recommendations }` → **202** + `jobId` → poll `GET /api/jobs/:jobId`.

Provider: `ARCHITECTURE_DECISION_GENERATOR_PROVIDER=template` (default) or `openai`.

## 4. View and export (`/architecture-decisions/:id`)

Summary and full markdown views; copy and download. Example document: [startup-cost-optimized.md](../adrs/startup-cost-optimized.md).

## Other scenarios

| Scenario | Context | ADR example |
|----------|---------|-------------|
| Enterprise | [enterprise-compliance.json](../scenarios/enterprise-compliance.json) | [enterprise-compliance.md](../adrs/enterprise-compliance.md) |
| High traffic | [scale-high-traffic.json](../scenarios/scale-high-traffic.json) | Generate in UI |

## API (curl)

```bash
# Evaluate (returns jobId)
curl -s -X POST http://localhost:3001/api/recommendations/evaluate \
  -H 'Content-Type: application/json' \
  -d '{"context":{"teamSize":"1-5","trafficPattern":"low-steady","budgetSensitivity":"cost-optimized","complianceRequirements":[],"operationalMaturity":"minimal"}}'

# Poll job
curl -s http://localhost:3001/api/jobs/{jobId}

# List ADRs
curl -s 'http://localhost:3001/api/architecture-decisions'
```

Full contracts: [reference.md](../../reference.md).
