import type {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
    const hasArchitectureDecisionsTable = await knex.schema.hasTable('architecture_decisions');

    if (!hasArchitectureDecisionsTable) {
        await knex.schema.createTable('architecture_decisions', (table) => {
            table.string('id').primary();
            table.string('title').notNullable();
            table.string('status').notNullable();
            table.text('content').notNullable();
            table.text('summary').notNullable();
            table.string('created_at').notNullable();
        });
    }

    // Legacy table from an earlier schema name; safe to drop when empty or unused.
    await knex.schema.dropTableIfExists('adrs');
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('architecture_decisions');
}
