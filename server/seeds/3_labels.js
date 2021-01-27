exports.seed = async (knex) => {
  await knex('labels').del();
  await knex('labels').insert([
    { name: 'first label' },
    { name: 'second label' },
    { name: 'third label' },
  ]);
};
