// @ts-check

exports.up = (knex) => (
  knex.schema
  .createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('password_digest').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
  .createTable('statuses', (table) => {
    table.increments('id').unsigned().primary();
    table.string('name').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
  .createTable('tasks', (table) => {
    table.increments('id').unsigned().primary();
    table.string('name').notNullable();
    table.string('description');
    table.integer('status_id').unsigned().references('id').inTable('statuses');
    table.integer('creator_id').unsigned().references('id').inTable('users')
    table.integer('executor_id').unsigned().references('id').inTable('users')
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
  .createTable('labels', (table) => {
    table.increments('id').unsigned().primary();
    table.string('name');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
  .createTable('tasks_labels', (table) => {
    table.increments('id').unsigned().primary();
    table.integer('label_id').unsigned().references('id').inTable('labels');
    table.integer('task_id').unsigned().references('id').inTable('tasks');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
);

exports.down = (knex) => knex
  .schema
  .dropTable('users')
  .dropTable('statuses')
  .dropTable('tasks')
  .dropTable('labels')
  .dropTable('tasks_labels');
