// @ts-check

exports.up = (knex) => (
  knex.schema.createTable('statuses', (table) => {
    table
      .increments('id')
      .unsigned()
      .primary();

    table
      .string('name')
      .notNullable();

    table
      .timestamp('created_at')
      .defaultTo(knex.fn.now());

    table
      .timestamp('updated_at')
      .defaultTo(knex.fn.now());
  })
);

exports.down = (knex) => knex.schema.dropTable('statuses');
