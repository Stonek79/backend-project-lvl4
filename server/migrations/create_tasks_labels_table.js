// @ts-check

exports.up = (knex) => (
  knex.schema.createTable('tasks_labels', (table) => {
    table
      .increments('id')
      .unsigned()
      .primary();

    table
      .integer('label_id')
      .unsigned()
      .references('id')
      .inTable('labels')
      .index()
      .onDelete('SET NULL');

    table
      .integer('task_id')
      .unsigned()
      .references('id')
      .inTable('tasks')
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

exports.down = (knex) => knex.schema.dropTable('tasks_labels');
