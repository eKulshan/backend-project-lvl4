exports.seed = async (knex) => {
  await knex('users').del();
  await knex('users').insert([
    {
      firstname: 'Bob',
      lastname: 'Marley',
      email: 'bobmarley@mail.com',
      password_digest: 'd132e4bc948e1cc12383afe9439fdee37eaf63dba3041639c64739d93a601bfd',
    },
    {
      firstname: 'James',
      lastname: 'Bond',
      email: '007@mail.com',
      password_digest: '3eed0f33297699415de55d2d980e60d30869bf6564e2055b62173d368974a149',
    },
  ]);
};
