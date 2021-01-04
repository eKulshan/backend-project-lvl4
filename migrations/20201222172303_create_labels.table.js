exports.up = async (knex) => {
  await knex.schema.createTable('labels', (table) => {
    table.increments('id').primary();
    table.string('name', 255).unique().notNullable();
  })
  await knex.schema.createTable('tasks_labels', (table) => {
    table.increments('id').primary();
    table.integer('task_id').references('tasks.id');
    table.integer('label_id').references('labels.id');
  })
};

exports.down = async (knex) => {
  await knex.schema.dropTable('tasks_labels');
  await knex.schema.dropTable('labels');
} 
