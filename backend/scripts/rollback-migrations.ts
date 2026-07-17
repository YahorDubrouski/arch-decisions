// Outside tsconfig rootDir: use relative imports — `@/` can hang under tsx here.
async function main(): Promise<void> {
    const {getArchitectureDecisionStorageProvider} = await import('../src/config/storage.config.ts');
    const {destroyKnex, getKnex} = await import('../src/integrations/storage/knex.client.ts');

    if (getArchitectureDecisionStorageProvider() !== 'sqlite') {
        console.log('Skipping migration rollback: STORAGE_PROVIDER is not sqlite');
        return;
    }

    const knex = getKnex();
    await knex.migrate.rollback();
    await destroyKnex();
}

main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
});
