exports.up = (knex) => (
  knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('description').defaultTo('');
    table.integer('status_id').references('statuses.id').notNullable();
    table.integer('creator_id').references('users.id').notNullable();
    table.integer('executor_id').references('users.id');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
);

exports.down = (knex) => knex.schema.dropTable('tasks');
