import i18next from 'i18next';
import _ from 'lodash';

export default async (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const { models } = await app.objection;

      const { executor, label, status } = _.pickBy(req.query, (q) => q.length);
      const creator = req.query.isCreatorUser === 'on' ? req.user.id : _.noop();
      const filter = {
        creator, executor, label, status,
      };
      const [statuses, executors, labels, tasks] = await Promise.all([
        models.status.query(),
        models.user.query(),
        models.label.query(),
        models.task.query()
          .skipUndefined()
          .withGraphJoined('[status, creator, executor, labels]')
          .where('statusId', status)
          .where('executorId', executor)
          .where('creatorId', creator)
          .where('labelId', label),
      ]);

      return reply.render('tasks/index', {
        filter, statuses, executors, labels, tasks,
      });
    })

    .get('/tasks/new', { name: 'newTask' }, async (_req, reply) => {
      const { models } = await app.objection;

      const [task, tasksExecutors, statuses, labels] = await Promise.all([
        new models.task(),
        models.user.query(),
        models.status.query(),
        models.label.query(),
      ]);
      const executors = tasksExecutors.map((e) => ({ ...e, name: `${e.firstName} ${e.lastName}` }));

      return reply.render('tasks/new', {
        task, executors, statuses, labels,
      });
    })

    .get('/tasks/:id', { name: 'taskInfo' }, async (req, reply) => {
      const task = await app.objection.models.task
        .query()
        .withGraphFetched('[status, creator, executor, labels]')
        .findById(req.params.id);

      return reply.render('tasks/info', { task });
    })

    .get('/tasks/:id/edit', {
      name: 'editTask', preValidation: app.authenticate,
    }, async (req, reply) => {
      const { models } = await app.objection;
      const [task, statuses, tasksExecutors, labels] = await Promise.all([
        models.task
          .query()
          .withGraphFetched('labels')
          .findById(req.params.id),
        models.status.query(),
        models.user.query(),
        models.label.query(),
      ]);

      const executors = tasksExecutors.map((e) => ({ ...e, name: `${e.firstName} ${e.lastName}` }));

      return reply.render('tasks/edit', {
        task, statuses, executors, labels,
      });
    })

    .post('/tasks', async (req, reply) => {
      const { models } = await app.objection;
      const { labels = [], ...taskData } = req.body.data;
      const labelsIds = [labels].flat().map((label) => ({ id: Number(label) }));
      const currentTask = {
        name: taskData.name,
        description: taskData.description,
        statusId: Number(taskData.statusId),
        executorId: taskData.executorId ? Number(taskData.executorId) : null,
        creatorId: req.user.id,
        labels: labelsIds,
      };

      try {
        await models.task.transaction((trx) => (
          models.task.query(trx).upsertGraph(currentTask,
            { relate: true, unrelate: true, noUpdate: ['labels'] })
        ));

        req.flash('info', i18next.t('flash.tasks.create.success'));
        return reply.redirect(app.reverse('tasks'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.create.error'));
        const [statuses, executors, lbels] = await Promise.all([
          models.status.query(),
          models.user.query(),
          models.label.query(),
        ]);
        const currentTaskData = {
          labels: lbels, executors, statuses, task: req.body.data,
        };

        return reply.render('tasks/new', { ...currentTaskData, errors: data });
      }
    })

    .patch('/tasks/:id', { name: 'updateTask' }, async (req, reply) => {
      const { models } = await app.objection;
      const { labels = [], ...taskData } = req.body.data;
      const labelsIds = [labels].flat().map((label) => ({ id: Number(label) }));
      const { creatorId } = await models.task.query().findById(req.params.id);

      const currentTask = {
        id: Number(req.params.id),
        name: taskData.name,
        description: taskData.description,
        statusId: Number(taskData.statusId),
        executorId: taskData.executorId ? Number(taskData.executorId) : null,
        creatorId,
        labels: labelsIds,
      };

      try {
        await models.task.transaction((trx) => (
          models.task.query(trx).upsertGraph(currentTask,
            { relate: true, unrelate: true, noUpdate: ['labels'] })
        ));

        req.flash('info', i18next.t('flash.tasks.update.success'));
        return reply.redirect(app.reverse('tasks'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.update.error'));
        const [statuses, executors, lbels] = await Promise.all([
          models.status.query(),
          models.user.query(),
          models.label.query(),
        ]);
        const currentTaskData = {
          labels: lbels, executors, statuses, task: req.body.data,
        };

        return reply.render('tasks/edit', { ...currentTaskData, errors: data });
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
      } else {
        await models.task.query().deleteById(req.params.id);
        req.flash('info', i18next.t('flash.tasks.delete.success'));
      }

      reply.redirect(app.reverse('tasks'));
    });
};
