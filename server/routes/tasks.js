import i18next from 'i18next';
import _ from 'lodash';

export default async (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const { executor, label, status } = _.pickBy(req.query, (q) => q.length);
      const creator = req.query.isCreatorUser === 'on' ? req.user.id : _.noop();
      const filter = {
        creator, executor, label, status,
      };

      const { models } = await app.objection;
      const statuses = await models.status.query();
      const executors = await models.user.query();
      const labels = await models.label.query();

      const tasks = await models.task.query()
        .skipUndefined()
        .withGraphJoined('[status, creator, executor, labels]')
        .where('statusId', status)
        .where('executorId', executor)
        .where('creatorId', creator)
        .where('labelId', label);

      return reply.render('tasks/index', {
        tasks, statuses, executors, labels, filter,
      });
    })

    .get('/tasks/new', { name: 'newTask' }, async (_req, reply) => {
      const task = await new app.objection.models.task();
      const executors = await app.objection.models.user.query();
      const statuses = await app.objection.models.status.query();
      const labels = await app.objection.models.label.query();

      return reply.render('tasks/new', {
        task, executors, statuses, labels,
      });
    })

    .get('/tasks/:id', { name: 'taskInfo' }, async (req, reply) => {
      const task = await app.objection.models.task
        .query()
        .withGraphFetched('[status, creator, executor, labels]')
        .findById(req.params.id);

      console.log(task);
      return reply.render('tasks/info', { task });
    })

    .get('/tasks/:id/edit', {
      name: 'editTask', preValidation: app.authenticate,
    }, async (req, reply) => {
      const { models } = await app.objection;
      const task = await models.task
        .query()
        .withGraphFetched('[status, creator, executor]')
        .findById(req.params.id);

      const statuses = await models.status.query();
      const executors = await models.user.query();
      const labels = await models.label.query();

      return reply.render('tasks/edit', {
        task, statuses, executors, labels,
      });
    })

    .post('/tasks', async (req, reply) => {
      const { models } = await app.objection;
      const { labels = [], ...taskData } = req.body.data;
      const currentTask = {
        name: taskData.name,
        description: taskData.description,
        statusId: taskData.statusId ? Number(taskData.statusId) : '',
        executorId: Number(taskData.executorId),
        creatorId: req.user.id,
      };
      const labelsIds = [labels].flat().map((label) => ({ id: Number(label) }));

      try {
        const task = await models.task.fromJson({ ...currentTask });

        await models.task.transaction((trx) => (
          models.task.query(trx).upsertGraphAndFetch(
            { ...task, labels: labelsIds },
            { relate: true, unrelate: true, noUpdate: ['labels'] },
          )
        ));

        req.flash('info', i18next.t('flash.tasks.create.success'));
        return reply.redirect(app.reverse('tasks'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.create.error'));
        const tsks = req.body.data;
        const statuses = await models.status.query();
        const executors = await models.user.query();
        const lbels = await models.label.query();
        const currentTaskData = {
          labels: lbels, executors, statuses, task: tsks,
        };

        return reply.render('tasks/new', { ...currentTaskData, errors: data });
      }
    })

    .patch('/tasks/:id', { name: 'updateTask' }, async (req, reply) => {
      const { models } = await app.objection;
      const { labels = [], ...taskData } = req.body.data;
      const currentTask = {
        name: taskData.name,
        description: taskData.description,
        statusId: taskData.statusId ? Number(taskData.statusId) : '',
        executorId: Number(taskData.executorId),
        creatorId: req.user.id,
      };
      const labelsIds = [labels].flat().map((label) => ({ id: Number(label) }));

      try {
        const task = await models.task.fromJson({ ...currentTask });

        await models.task.transaction((trx) => (
          models.task.query(trx).upsertGraphAndFetch(
            { id: Number(req.params.id), ...task, labels: labelsIds },
            { relate: true, unrelate: true, noUpdate: ['labels'] },
          )
        ));

        req.flash('info', i18next.t('flash.tasks.update.success'));
        return reply.redirect(app.reverse('tasks'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.update.error'));
        const tsks = req.body.data;
        const statuses = await models.status.query();
        const executors = await models.user.query();
        const lbels = await models.label.query();
        const currentTaskData = {
          labels: lbels, executors, statuses, task: tsks,
        };

        return reply.render('tasks/new', { ...currentTaskData, errors: data });
      }
    })

    .delete('/tasks/:id', { name: 'deleteTask' }, async (req, reply) => {
      const { models } = app.objection;
      const task = await models.task
        .query()
        .withGraphFetched('[status, creator, executor]')
        .findById(req.params.id);

      if (task.creatorId !== req.user.id) {
        req.flash('error', i18next.t('flash.tasks.delete.notAllowed'));
      }
      await models.task.query().deleteById(req.params.id);
      req.flash('info', i18next.t('flash.tasks.delete.success'));

      reply.redirect(app.reverse('tasks'));
    });
};
