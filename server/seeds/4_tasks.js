exports.seed = async (knex) => {
  await knex('tasks').del();
  await knex('tasks').insert([
    {
      name: 'first task name',
      description: 'first task description',
      status_id: 1,
      creator_id: 1,
      executor_id: 1,
    },
    {
      name: 'second task name',
      description: 'second task description',
      status_id: 1,
      creator_id: 2,
      executor_id: 2,
    },
  ]);

  await knex('tasks_labels').del();
  await knex('tasks_labels').insert([
    {
      task_id: 1,
      label_id: 3,
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
