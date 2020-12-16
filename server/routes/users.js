import i18next from 'i18next';

export default (app) => {
  app
    .get('/users/:id/edit', { name: 'editUser', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const user = await app.objection.models.user.query().findById(id);
      reply.render('users/edit', { user });
      return reply;
    })

    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { user: req.user, users });
      return reply;
    })

    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })

    .post('/users', async (req, reply) => {
      try {
        const user = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(user);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('newSession'), {});
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user: req.body.data, errors: data });
        return reply;
      }
    })

    .patch('/users/:id', async (req, reply) => {
      try {
        const { id } = req.params;
        if (id !== String(req.user.id)) {
          reply.code(403).send();
          return;
        }
        const updateData = await app.objection.models.user.fromJson(req.body.data);
        const user = await app.objection.models.user.query().findById(id);
        await user.$query().update(updateData);
        req.flash('info', i18next.t('flash.users.update.success'));
        reply.redirect(app.reverse('root'), {});
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.update.error'));
        reply.render('users/edit', { user: req.user, errors: data });
      }
    })

    .delete('/users/:id', async (req, reply) => {
      try {
        const { id } = req.params;
        if (id !== String(req.user.id)) {
          reply.code(403).send();
          return;
        }
        req.logOut();
        await app.objection.models.user.query().deleteById(id);
        req.flash('info', i18next.t('flash.users.delete.success'));
        reply.redirect(app.reverse('users'), {});
      } catch (e) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        reply.redirect(app.reverse('users'));
      }
    });
};
