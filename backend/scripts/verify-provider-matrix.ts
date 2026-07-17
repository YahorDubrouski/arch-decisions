// Outside tsconfig rootDir: use relative imports — `@/` can hang under tsx here.
// Example: `import '@/…'` from scripts/ → hang; `import('../src/…')` → loads normally.
async function main(): Promise<void> {
    const {createRecommendationProvider} = await import(
        '../src/integrations/openai/recommendation-provider.factory.ts'
    );
    const {createArchitectureDecisionGeneratorProvider} = await import(
        '../src/integrations/openai/architecture-decision-provider.factory.ts'
    );
    const {createArchitectureDecisionRepository} = await import(
        '../src/integrations/storage/architecture-decision-repository.factory.ts'
    );
    const {MockRecommendationProvider} = await import('../src/integrations/openai/openai.mock.provider.ts');
    const {OpenAIRecommendationsProvider} = await import(
        '../src/integrations/openai/openai-recommendations.provider.ts'
    );
    const {TemplateArchitectureDecisionProvider} = await import(
        '../src/integrations/openai/template-architecture-decision.provider.ts'
    );
    const {OpenAIArchitectureDecisionProvider} = await import(
        '../src/integrations/openai/openai-architecture-decision.provider.ts'
    );
    const {SqliteArchitectureDecisionRepository} = await import(
        '../src/integrations/storage/sqlite-architecture-decision.repository.ts'
    );
    const {InMemoryArchitectureDecisionRepository} = await import(
        '../src/integrations/storage/in-memory-architecture-decision.repository.ts'
    );
    const {buildProjectContext} = await import('../src/test/fixtures/project-context.fixture.ts');
    const {destroyKnex} = await import('../src/integrations/storage/knex.client.ts');

    type CheckResult = {id: string; ok: boolean; detail: string};
    const results: CheckResult[] = [];

    function record(id: string, ok: boolean, detail: string): void {
        results.push({id, ok, detail});
        const mark = ok ? 'PASS' : 'FAIL';
        console.log(`[${mark}] ${id}: ${detail}`);
    }

    const original = {
        recommendation: process.env.RECOMMENDATION_PROVIDER,
        adr: process.env.ARCHITECTURE_DECISION_GENERATOR_PROVIDER,
        storage: process.env.STORAGE_PROVIDER,
        apiKey: process.env.OPENAI_API_KEY,
    };

    function restoreEnv(): void {
        setOrDelete('RECOMMENDATION_PROVIDER', original.recommendation);
        setOrDelete('ARCHITECTURE_DECISION_GENERATOR_PROVIDER', original.adr);
        setOrDelete('STORAGE_PROVIDER', original.storage);
        setOrDelete('OPENAI_API_KEY', original.apiKey);
    }

    function setOrDelete(key: string, value: string | undefined): void {
        if (value === undefined) {
            delete process.env[key];
            return;
        }
        process.env[key] = value;
    }

    const context = buildProjectContext({
        teamSize: '1-5',
        budgetSensitivity: 'cost-optimized',
    });

    // --- B: mock + template + sqlite (default hire path) ---
    try {
        setOrDelete('RECOMMENDATION_PROVIDER', 'mock');
        setOrDelete('ARCHITECTURE_DECISION_GENERATOR_PROVIDER', 'template');
        setOrDelete('STORAGE_PROVIDER', 'sqlite');

        const recommendations = createRecommendationProvider();
        const generator = createArchitectureDecisionGeneratorProvider();
        const repository = createArchitectureDecisionRepository();

        if (!(recommendations instanceof MockRecommendationProvider)) {
            throw new Error('expected MockRecommendationProvider');
        }
        if (!(generator instanceof TemplateArchitectureDecisionProvider)) {
            throw new Error('expected TemplateArchitectureDecisionProvider');
        }
        if (!(repository instanceof SqliteArchitectureDecisionRepository)) {
            throw new Error('expected SqliteArchitectureDecisionRepository');
        }

        const evaluated = await recommendations.evaluateAll(context);
        const draft = await generator.generate(context, evaluated);
        if (!evaluated.compute.recommended || !draft.title || !draft.content) {
            throw new Error('empty evaluate/generate output');
        }

        record('B', true, `mock+template+sqlite → ${evaluated.compute.recommended}, ADR "${draft.title}"`);
    } catch (error) {
        record('B', false, error instanceof Error ? error.message : String(error));
    }

    // --- C: mock + template + memory ---
    try {
        setOrDelete('RECOMMENDATION_PROVIDER', 'mock');
        setOrDelete('ARCHITECTURE_DECISION_GENERATOR_PROVIDER', 'template');
        setOrDelete('STORAGE_PROVIDER', 'memory');

        const recommendations = createRecommendationProvider();
        const generator = createArchitectureDecisionGeneratorProvider();
        const repository = createArchitectureDecisionRepository();

        if (!(recommendations instanceof MockRecommendationProvider)) {
            throw new Error('expected MockRecommendationProvider');
        }
        if (!(generator instanceof TemplateArchitectureDecisionProvider)) {
            throw new Error('expected TemplateArchitectureDecisionProvider');
        }
        if (!(repository instanceof InMemoryArchitectureDecisionRepository)) {
            throw new Error('expected InMemoryArchitectureDecisionRepository');
        }

        const evaluated = await recommendations.evaluateAll(context);
        await generator.generate(context, evaluated);
        const listed = repository.list();
        if (!Array.isArray(listed)) {
            throw new Error('memory list failed');
        }

        record('C', true, 'mock+template+memory evaluate/generate/list OK');
    } catch (error) {
        record('C', false, error instanceof Error ? error.message : String(error));
    }

    const hasApiKey = Boolean(original.apiKey?.trim());

    // --- D: openai recommendations + template ADR ---
    if (!hasApiKey) {
        record('D', false, 'skipped — OPENAI_API_KEY not set in environment');
    } else {
        try {
            setOrDelete('RECOMMENDATION_PROVIDER', 'openai');
            setOrDelete('ARCHITECTURE_DECISION_GENERATOR_PROVIDER', 'template');
            setOrDelete('STORAGE_PROVIDER', 'sqlite');
            setOrDelete('OPENAI_API_KEY', original.apiKey);

            const recommendations = createRecommendationProvider();
            const generator = createArchitectureDecisionGeneratorProvider();
            if (!(recommendations instanceof OpenAIRecommendationsProvider)) {
                throw new Error('expected OpenAIRecommendationsProvider');
            }
            if (!(generator instanceof TemplateArchitectureDecisionProvider)) {
                throw new Error('expected TemplateArchitectureDecisionProvider');
            }

            const evaluated = await recommendations.evaluateAll(context);
            const draft = await generator.generate(context, evaluated);
            if (!evaluated.compute.recommended || !draft.content) {
                throw new Error('empty OpenAI evaluate / template generate');
            }

            record('D', true, `openai+template → ${evaluated.compute.recommended}`);
        } catch (error) {
            record('D', false, error instanceof Error ? error.message : String(error));
        }
    }

    // --- E: mock recommendations + openai ADR ---
    if (!hasApiKey) {
        record('E', false, 'skipped — OPENAI_API_KEY not set in environment');
    } else {
        try {
            setOrDelete('RECOMMENDATION_PROVIDER', 'mock');
            setOrDelete('ARCHITECTURE_DECISION_GENERATOR_PROVIDER', 'openai');
            setOrDelete('OPENAI_API_KEY', original.apiKey);

            const recommendations = createRecommendationProvider();
            const generator = createArchitectureDecisionGeneratorProvider();
            if (!(recommendations instanceof MockRecommendationProvider)) {
                throw new Error('expected MockRecommendationProvider');
            }
            if (!(generator instanceof OpenAIArchitectureDecisionProvider)) {
                throw new Error('expected OpenAIArchitectureDecisionProvider');
            }

            const evaluated = await recommendations.evaluateAll(context);
            const draft = await generator.generate(context, evaluated);
            if (!draft.title || !draft.content) {
                throw new Error('empty OpenAI ADR draft');
            }

            record('E', true, `mock+openai ADR → "${draft.title}"`);
        } catch (error) {
            record('E', false, error instanceof Error ? error.message : String(error));
        }
    }

    // --- F: openai + openai ---
    if (!hasApiKey) {
        record('F', false, 'skipped — OPENAI_API_KEY not set in environment');
    } else {
        try {
            setOrDelete('RECOMMENDATION_PROVIDER', 'openai');
            setOrDelete('ARCHITECTURE_DECISION_GENERATOR_PROVIDER', 'openai');
            setOrDelete('OPENAI_API_KEY', original.apiKey);

            const recommendations = createRecommendationProvider();
            const generator = createArchitectureDecisionGeneratorProvider();
            if (!(recommendations instanceof OpenAIRecommendationsProvider)) {
                throw new Error('expected OpenAIRecommendationsProvider');
            }
            if (!(generator instanceof OpenAIArchitectureDecisionProvider)) {
                throw new Error('expected OpenAIArchitectureDecisionProvider');
            }

            const evaluated = await recommendations.evaluateAll(context);
            const draft = await generator.generate(context, evaluated);
            if (!evaluated.compute.recommended || !draft.content) {
                throw new Error('empty full OpenAI path');
            }

            record('F', true, `openai+openai → ${evaluated.compute.recommended}, ADR "${draft.title}"`);
        } catch (error) {
            record('F', false, error instanceof Error ? error.message : String(error));
        }
    }

    // --- G: openai recommendations without key must throw ---
    try {
        setOrDelete('RECOMMENDATION_PROVIDER', 'openai');
        delete process.env.OPENAI_API_KEY;

        let threw = false;
        try {
            createRecommendationProvider();
        } catch (error) {
            threw =
                error instanceof Error &&
                error.message.includes('RECOMMENDATION_PROVIDER is openai but OPENAI_API_KEY is not set.');
        }
        if (!threw) {
            throw new Error('expected throw for missing key');
        }
        record('G', true, 'openai recommendations without key throws');
    } catch (error) {
        record('G', false, error instanceof Error ? error.message : String(error));
    }

    // --- H: openai ADR without key must throw ---
    try {
        setOrDelete('ARCHITECTURE_DECISION_GENERATOR_PROVIDER', 'openai');
        delete process.env.OPENAI_API_KEY;

        let threw = false;
        try {
            createArchitectureDecisionGeneratorProvider();
        } catch (error) {
            threw =
                error instanceof Error &&
                error.message.includes(
                    'ARCHITECTURE_DECISION_GENERATOR_PROVIDER is openai but OPENAI_API_KEY is not set.'
                );
        }
        if (!threw) {
            throw new Error('expected throw for missing key');
        }
        record('H', true, 'openai ADR without key throws');
    } catch (error) {
        record('H', false, error instanceof Error ? error.message : String(error));
    }

    restoreEnv();
    await destroyKnex().catch(() => undefined);

    const failed = results.filter((result) => !result.ok);
    console.log('');
    console.log(`Provider matrix: ${results.length - failed.length}/${results.length} passed`);
    if (failed.length > 0) {
        process.exitCode = 1;
    }
}

main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
});
