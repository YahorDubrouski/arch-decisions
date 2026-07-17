# UI screenshots

Desktop showcase captures (1440×900 viewport, Playwright) for README and journey docs.

| File | Screen | Route |
|------|--------|-------|
| [01-home.png](./01-home.png) | Landing + brand flow diagram | `/` |
| [02-context.png](./02-context.png) | Context wizard (step 1) | `/context` |
| [03-recommendations.png](./03-recommendations.png) | Compute / Secrets / CI/CD cards | `/recommendations` |
| [04-documents-grid.png](./04-documents-grid.png) | Documents table + pagination | `/architecture-decisions` |
| [05-adr-summary.png](./05-adr-summary.png) | ADR summary view | `/architecture-decisions/:id` |
| [06-adr-full.png](./06-adr-full.png) | ADR full markdown document | `/architecture-decisions/:id` |
| [07-swagger-express.png](./07-swagger-express.png) | Swagger UI — Express API | `http://localhost:3001/api-docs` |
| [08-swagger-python.png](./08-swagger-python.png) | Swagger UI — Python API | `http://localhost:3002/docs` |

Regenerate UI shots after major frontend changes against Vite (`http://localhost:5174`).  
Regenerate Swagger shots against the running APIs after OpenAPI schema/route changes (Express: `backend/src/openapi/`, Python: `backend-python/.../api/schemas` + routes).
