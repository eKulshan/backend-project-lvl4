const { table } = require("console");

exports.up = (knex) => {
  return knex.schema
  .createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email');
    table.string('password_digest');
    table.string('firstname');
    table.string('lastname');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
  .createTable('statuses', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
};

exports.down = (knex) => {
  return knex.schema
    .dropTable('users')
    .dropTable('statuses')
};