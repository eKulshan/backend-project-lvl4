import i18next from 'i18next';
import customizeErrors from '../lib/customizeErrors.js';

export default (app) => {
  app
    .get('/labels/:id/edit', { name: 'editLabel', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const label = await app.objection.models.label.query().findById(id);
      reply.render('labels/edit', { label });
      return reply;
    })
    .get('/labels/new', { name: 'newLabel', preValidation: app.authenticate }, async (req, reply) => {
      const label = await new app.objection.models.label();
      reply.render('labels/new', { label });
      return reply;
    })
    .get('/labels', { name: 'labels', preValidation: app.authenticate }, async (req, reply) => {
      const labels = await app.objection.models.label.query().orderBy('id');
      reply.render('labels/index', { labels });
      return reply;
    })
    .post('/labels', { name: 'createLabel', preValidation: app.authenticate }, async (req, reply) => {
      try {
        const label = await app.objection.models.label.fromJson(req.body.data);
        await app.objection.models.label.query().insert(label);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect(app.reverse('labels'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.code(422);
        reply.render('labels/new', { label: req.body.data, errors: customizeErrors(data) });
      }
      return reply;
    })
    .patch('/labels/:id', { name: 'patchLabel', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      try {
        const updateData = await app.objection.models.label.fromJson(req.body.data);
        const label = await app.objection.models.label.query().findById(id);
        await label.$query().update(updateData);
        req.flash('info', i18next.t('flash.labels.update.success'));
        reply.redirect(app.reverse('labels'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.update.error'));
        reply.code(422);
        reply.render('labels/edit', { label: { id, ...req.body.data }, errors: customizeErrors(data) });
      }
      return reply;
    })
    .delete('/labels/:id', { name: 'deleteLabel', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      try {
        await app.objection.models.label.query().deleteById(id);
        req.flash('info', i18next.t('flash.labels.delete.success'));
        reply.redirect(app.reverse('labels'));
      } catch (e) {
        req.flash('error', i18next.t('flash.labels.delete.error'));
        reply.redirect(app.reverse('labels'));
      }
      return reply;
    });
};
