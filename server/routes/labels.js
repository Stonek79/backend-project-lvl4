import i18next from 'i18next';

export default async (app) => app
  .get('/labels', { name: 'labels' }, async (_req, reply) => {
    const labels = await app.objection.models.label.query();
    return reply.render('labels/index', { labels });
  })

  .get('/labels/new',
    { name: 'newLabel' },
    (_req, reply) => {
      const label = new app.objection.models.label();
      return reply.render('labels/new', { label });
    })

  .get('/labels/:id/edit',
    { name: 'editLabel', preValidation: app.authenticate },
    async (req, reply) => {
      const label = await app.objection.models.label.query().findById(req.params.id);
      return reply.render('labels/edit', { label });
    })

  .post('/labels', async (req, reply) => {
    const { models } = app.objection;
    try {
      const label = await models.label.fromJson(req.body.data);
      await models.label.query().insert(label);

      req.flash('info', i18next.t('flash.labels.create.success'));
      return reply.redirect(app.reverse('labels'));
    } catch ({ data }) {
      req.flash('error', i18next.t('flash.labels.create.error'));
      return reply.render('labels/new', { labels: req.body.data, errors: data });
    }
  })

  .patch('/labels/:id', async (req, reply) => {
    const { models } = app.objection;
    try {
      const currentLabel = await models.label.fromJson(req.body.data);
      const label = await models.label.query().findById(req.params.id);
      await label.$query().update(currentLabel);

      req.flash('info', i18next.t('flash.labels.update.success'));
      return reply.redirect(app.reverse('labels'));
    } catch ({ data }) {
      req.flash('error', i18next.t('flash.labels.update.error'));
      return reply.render('labels/edit', { label: req.body.data, errors: data });
    }
  })

  .delete('/labels/:id', { name: 'deleteLabel' }, async (req, reply) => {
    const { models } = app.objection;
    const tasks = await models.label
      .relatedQuery('tasks')
      .for(req.params.id);

    if (tasks.length) {
      req.flash('error', i18next.t('flash.labels.delete.error'));
    } else {
      await models.label.query().deleteById(req.params.id);
      req.flash('info', i18next.t('flash.labels.delete.success'));
    }

    return reply.redirect(app.reverse('labels'));
  });
