import type {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('architecture_decisions', (table) => {
        table.string('id').primary();
        table.string('title').notNullable();
        table.string('status').notNullable();
        table.text('content').notNullable();
        table.text('summary').notNullable();
        table.string('created_at').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('architecture_decisions');
}
