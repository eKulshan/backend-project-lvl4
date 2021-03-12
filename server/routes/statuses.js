import i18next from 'i18next';
import customizeErrors from '../lib/customizeErrors.js';

export default (app) => {
  app
    .get('/statuses/:id/edit', { name: 'editStatus', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const status = await app.objection.models.status.query().findById(id);
      reply.render('statuses/edit', { status });
      return reply;
    })
    .get('/statuses/new', { name: 'newStatus', preValidation: app.authenticate }, async (req, reply) => {
      const status = await new app.objection.models.status();
      reply.render('statuses/new', { status });
      return reply;
    })
    .get('/statuses', { name: 'statuses', preValidation: app.authenticate }, async (req, reply) => {
      const statuses = await app.objection.models.status.query().orderBy('id');
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .post('/statuses', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const status = await app.objection.models.status.fromJson(req.body.data);
        await app.objection.models.status.query().insert(status);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.code(422);
        reply.render('statuses/new', { status: req.body.data, errors: customizeErrors(data) });
      }
      return reply;
    })
    .patch('/statuses/:id', { name: 'patchStatus', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      try {
        const updateData = await app.objection.models.status.fromJson(req.body.data);
        const status = await app.objection.models.status.query().findById(id);
        await status.$query().update(updateData);
        req.flash('info', i18next.t('flash.statuses.update.success'));
        reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.update.error'));
        reply.code(422);
        reply.render('statuses/edit', { status: { id, ...req.body.data }, errors: customizeErrors(data) });
      }
      return reply;
    })
    .delete('/statuses/:id', { name: 'deleteStatus', preValidation: app.authenticate }, async (req, reply) => {
      try {
        const { id } = req.params;
        await app.objection.models.status.query().deleteById(id);
        req.flash('info', i18next.t('flash.statuses.delete.success'));
        reply.redirect(app.reverse('statuses'));
      } catch (e) {
        req.flash('error', i18next.t('flash.statuses.delete.error'));
        reply.redirect(app.reverse('statuses'));
      }
      return reply;
    });
};
