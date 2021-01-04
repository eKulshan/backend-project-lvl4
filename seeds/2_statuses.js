exports.seed = async (knex) => {
  await knex('statuses').del();
  await knex('statuses').insert([
    {
      name: 'Новая',
    },
    {
      name: 'Исследование',
    },
    {
      name: 'Обсуждение',
    },
    {
      name: 'В процессе',
    },
    {
      name: 'Оценка результатов',
    },
    {
      name: 'Завершено',
    },
  ]);
};
