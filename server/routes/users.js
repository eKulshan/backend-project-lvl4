import i18next from 'i18next';
import customizeErrors from '../lib/customizeErrors.js';

export default (app) => {
  app
    .get('/users/:id/edit', { name: 'editUser', preValidation: app.authorize }, async (req, reply) => {
      const { id } = req.params;
      const user = await app.objection.models.user.query().findById(id);
      reply.render('users/edit', { id: req.user.id, user });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
      return reply;
    })
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { id: req?.user?.id, users });
      return reply;
    })
    .post('/users', async (req, reply) => {
      try {
        await app.objection.models.user.query().insert(req.body.data);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'), {});
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user: req.body.data, errors: customizeErrors(data) });
        return reply;
      }
    })
    .patch('/users/:id/password', { preValidation: app.authorize }, async (req, reply) => {
      const { id } = req.params;
      const user = await app.objection.models.user.query().findById(id);
      try {
        await user.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.users.update.success'));
        reply.redirect(app.reverse('root'), {});
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.update.error'));
        reply.render('users/edit', { id: req.user.id, user, errors: customizeErrors(data) });
        return reply;
      }
    })
    .patch('/users/:id', { preValidation: app.authorize }, async (req, reply) => {
      try {
        const { id } = req.params;
        const user = await app.objection.models.user.query().findById(id);
        await user.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.users.update.success'));
        reply.redirect(app.reverse('root'), {});
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.update.error'));
        reply.render('users/edit', { id: req.user.id, user: req.body.data, errors: customizeErrors(data) });
        return reply;
      }
    })
    .delete('/users/:id', { preValidation: app.authorize }, async (req, reply) => {
      try {
        const { id } = req.params;
        await app.objection.models.user.query().deleteById(id);
        req.logOut();
        req.flash('info', i18next.t('flash.users.delete.success'));
        reply.redirect(app.reverse('root'), {});
        return reply;
      } catch (e) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        reply.redirect(app.reverse('users'));
        return reply;
      }
    });
};
