// @ts-check

exports.up = (knex) => (
  knex.schema.createTable('tasks', (table) => {
    table
      .increments('id')
      .unsigned()
      .primary();

    table
      .string('name')
      .notNullable();

    table
      .string('description');

    table
      .integer('status_id')
      .unsigned()
      .references('id')
      .inTable('statuses')
      .index()
      .onDelete('SET NULL');

    table
      .integer('creator_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .index()
      .onDelete('SET NULL');

    table
      .integer('executor_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .index()
      .onDelete('SET NULL');

    table
      .timestamp('created_at')
      .defaultTo(knex.fn.now());

    table
      .timestamp('updated_at')
      .defaultTo(knex.fn.now());
  })
);

exports.down = (knex) => knex.schema.dropTable('tasks');
