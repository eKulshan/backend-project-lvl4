exports.seed = async (knex) => {
  await knex('tasks').del();
  await knex('tasks').insert([
    {
      name: 'Smoke',
      description: 'Smoke that weed',
      status_id: 1,
      creator_id: 1,
      executor_id: 1,
    },
    {
      name: 'Kill',
      description: 'Kill that man',
      status_id: 1,
      creator_id: 2,
      executor_id: 2,
    },
  ]);

  await knex('tasks_labels').del();
  await knex('tasks_labels').insert([
    {
      task_id: 1,
      label_id: 4,
    },
    {
      task_id: 2,
      label_id: 1,
    },
    {
      task_id: 2,
      label_id: 2,
    },
  ]);
};
