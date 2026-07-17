import {OpenAPIRegistry, OpenApiGeneratorV3} from '@asteasolutions/zod-to-openapi';

import {registerGenerateOpenApi} from '@/routes/architecture-decisions/generate.openapi.js';
import {registerGetOpenApi} from '@/routes/architecture-decisions/get.openapi.js';
import {registerListOpenApi} from '@/routes/architecture-decisions/list.openapi.js';
import {registerHealthOpenApi} from '@/routes/health/health.openapi.js';
import {registerGetJobOpenApi} from '@/routes/jobs/get.openapi.js';
import {registerEvaluateOpenApi} from '@/routes/recommendations/evaluate.openapi.js';

export function buildOpenApiDocument(): ReturnType<OpenApiGeneratorV3['generateDocument']> {
    const registry = new OpenAPIRegistry();

    // Each endpoint registers its own OpenAPI next to its route file.
    registerHealthOpenApi(registry);
    registerEvaluateOpenApi(registry);
    registerGenerateOpenApi(registry);
    registerListOpenApi(registry);
    registerGetOpenApi(registry);
    registerGetJobOpenApi(registry);

    const generator = new OpenApiGeneratorV3(registry.definitions);
    return generator.generateDocument({
        openapi: '3.0.3',
        info: {
            title: 'Architecture Decisions API',
            version: '1.0.0',
            description:
                'Express backend for architecture decision recommendations and ADR generation. ' +
                'OpenAPI is generated from Zod schemas and per-endpoint *.openapi.ts files.',
        },
        servers: [
            {
                url: '/',
                description: 'This API instance (use the host you opened Swagger on)',
            },
            {
                url: 'http://localhost:3001',
                description: 'Express (Docker)',
            },
        ],
        tags: [
            {name: 'health', description: 'Liveness'},
            {name: 'recommendations', description: 'Infrastructure recommendations'},
            {name: 'architecture-decisions', description: 'ADR list, detail, and generation'},
            {name: 'jobs', description: 'Async job status polling'},
        ],
    });
}
