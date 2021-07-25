// import i18next from 'i18next';

export default (app) => app
  .get('/tasks', { name: 'tasks' }, async (_req, reply) => {
    const statuses = await app.objection.models.task.query();
    return reply.render('task/index', { statuses });
  });
