import i18next from 'i18next';

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
      reply.render('labels/new', { user: req.user, label });
      return reply;
    })
    .get('/labels', { name: 'labels' }, async (req, reply) => {
      const labels = await app.objection.models.label.query();
      reply.render('labels/index', { id: req?.user?.id, labels });
      return reply;
    })
    .post('/labels', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const label = await app.objection.models.label.fromJson(req.body.data);
        await app.objection.models.label.query().insert(label);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect(app.reverse('labels'), {});
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('labels/new', { label: req.body.data, errors: data });
        return reply;
      }
    })
    .patch('/labels/:id', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const { id } = req.params;
        const updateData = await app.objection.models.label.fromJson(req.body.data);
        const label = await app.objection.models.label.query().findById(id);
        await label.$query().update(updateData);
        req.flash('info', i18next.t('flash.labels.update.success'));
        reply.redirect(app.reverse('labels'), {});
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.update.error'));
        reply.render('labels/edit', { label: req.body.data, errors: data });
      }
    })
    .delete('/labels/:id', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const { id } = req.params;
        await app.objection.models.label.query().deleteById(id);
        req.flash('info', i18next.t('flash.labels.delete.success'));
        reply.redirect(app.reverse('labels'), {});
      } catch (e) {
        req.flash('error', i18next.t('flash.labels.delete.error'));
        reply.redirect(app.reverse('labels'));
      }
    });
};
