exports.seed = async (knex) => {
  await knex('statuses').del();
  await knex('statuses').insert([
    { name: 'first status' },
    { name: 'second status' },
    { name: 'third status' },
  ]);
};
