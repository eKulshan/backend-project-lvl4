import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const task = await app.objection.models.task.query().findById(id);
      reply.render('tasks/edit', { task });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = await new app.objection.models.task();
      reply.render('tasks/new', { user: req.user, task });
      return reply;
    })
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const tasks = await app.objection.models.task.query().withGraphFetched('[creator, executor, status]');
      reply.render('tasks/index', { id: req?.user?.id, tasks });
      return reply;
    })
    .post('/tasks', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const normalizedData = {
          ...req.body.data,
          status_id: Number(req.body.data.status_id),
          creator_id: Number(req.body.data.creator_id),
          executor_id: Number(req.body.data.executor_id),
        };
        const task = await app.objection.models.task.fromJson(normalizedData);
        await app.objection.models.task.query().insert(task);
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'), {});
        return reply;
      } catch (e) {
        console.log(e);
        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', { task: req.body.data, errors: e.data });
        return reply;
      }
    })
    .patch('/tasks/:id', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const { id } = req.params;
        const updateData = await app.objection.models.task.fromJson(req.body.data);
        const task = await app.objection.models.task.query().findById(id);
        await task.$query().update(updateData);
        req.flash('info', i18next.t('flash.tasks.update.success'));
        reply.redirect(app.reverse('tasks'), {});
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.update.error'));
        reply.render('tasks/edit', { task: req.body.data, errors: data });
      }
    })
    .delete('/tasks/:id', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const { id } = req.params;
        const { creatorId } = await app.objection.models.task.query().findById(id);
        if (Number(id) !== creatorId) {
          throw new Error();
        }
        await app.objection.models.task.query().deleteById(id);
        req.flash('info', i18next.t('flash.tasks.delete.success'));
        reply.redirect(app.reverse('tasks'), {});
      } catch (e) {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
        reply.redirect(app.reverse('tasks'));
      }
    });
};
