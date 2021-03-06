import i18next from 'i18next';
import customizeErrors from '../lib/customizeErrors.js';

export default (app) => {
  app
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const task = await app.objection.models.task.query().withGraphFetched('labels').findById(id);
      const labels = await app.objection.models.label.query();
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      reply.render('tasks/edit', {
        task, labels, users, statuses,
      });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = await new app.objection.models.task();
      const labels = await app.objection.models.label.query();
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      reply.render('tasks/new', {
        task, labels, users, statuses,
      });
      return reply;
    })
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const labels = await app.objection.models.label.query();
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const { id } = req.user;
      const query = req.query || {};
      const tasks = await app.objection.models.task.query().withGraphFetched('[creator, executor, status, labels]')
        .modify('filterStatus', query.status_id)
        .modify('filterExecutor', query.executor_id)
        .modify('filterIsCreatorUser', query.isCreatorUser === 'on' ? id : null)
        .modify('filterLabel', query.label_id)
        .orderBy('id');
      reply.render('tasks/index', {
        tasks, labels, statuses, users, query,
      });
      return reply;
    })
    .post('/tasks', { name: 'createTask', preValidation: app.authenticate }, async (req, reply) => {
      try {
        const { data } = req.body;
        const normalizedData = {
          ...data,
          creator_id: req.user.id,
          status_id: Number(data.status_id),
          executor_id: data.executor_id ? Number(data.executor_id) : null,
          labels: data.labels ? [...data.labels].map((id) => ({ id: Number(id) })) : [],
        };
        await app.objection.models.task.query().insertGraph(normalizedData, { relate: true });
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'), {});
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.create.error'));
        const labels = await app.objection.models.label.query();
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        reply.code(422);
        reply.render('tasks/new', {
          user: req.user,
          labels,
          users,
          statuses,
          task: req.body.data,
          errors: customizeErrors(data),
        });
      }
      return reply;
    })
    .patch('/tasks/:id', { name: 'patchTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      try {
        const { data } = req.body;
        const normalizedData = {
          id: Number(id),
          ...data,
          creator_id: req.user.id,
          status_id: Number(data.status_id),
          executor_id: data.executor_id ? Number(data.executor_id) : null,
          labels: data.labels ? [...data.labels].map((labelId) => ({ id: Number(labelId) })) : [],
        };
        await app.objection.models.task.query()
          .upsertGraph(normalizedData, { relate: true, unrelate: true });
        req.flash('info', i18next.t('flash.tasks.update.success'));
        reply.redirect(app.reverse('tasks'), {});
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.update.error'));
        const labels = await app.objection.models.label.query();
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        reply.code(422);
        reply.render('tasks/edit', {
          user: req.user,
          labels,
          users,
          statuses,
          task: { ...req.body.data, id },
          errors: customizeErrors(data),
        });
      }
      return reply;
    })
    .delete('/tasks/:id', { name: 'deleteTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      try {
        const { creatorId } = await app.objection.models.task.query().findById(id);
        if (req.user.id !== creatorId) {
          req.flash('error', i18next.t('flash.tasks.delete.error'));
          reply.redirect(app.reverse('tasks'));
        }
        await app.objection.models.task.query().deleteById(id);
        req.flash('info', i18next.t('flash.tasks.delete.success'));
        reply.redirect(app.reverse('tasks'), {});
      } catch (e) {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
        reply.redirect(app.reverse('tasks'));
      }
      return reply;
    });
};
