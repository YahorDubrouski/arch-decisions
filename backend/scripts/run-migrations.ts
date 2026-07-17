// Outside tsconfig rootDir: use relative imports — `@/` can hang under tsx here.
async function main(): Promise<void> {
    const {runSqliteMigrations} = await import('../src/integrations/storage/run-sqlite-migrations.ts');
    const {destroyKnex} = await import('../src/integrations/storage/knex.client.ts');

    await runSqliteMigrations();
    await destroyKnex();
}

main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
});
