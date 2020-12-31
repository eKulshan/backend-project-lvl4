exports.seed = async (knex) => {
  await knex('labels').del();
  await knex('labels').insert([
    { name: 'Клиент' },
    { name: 'Срочно' },
    { name: 'Созвон' },
    { name: 'Совещание' },
  ]);
};
