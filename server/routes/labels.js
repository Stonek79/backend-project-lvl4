import i18next from 'i18next';

export default async (app) => app
  .get('/labels', { name: 'labels', preValidation: app.authenticate }, async (_req, reply) => {
    const labels = await app.objection.models.label.query();
    return reply.render('labels/index', { labels });
  })

  .get('/labels/new',
    { name: 'newLabel', preValidation: app.authenticate },
    (_req, reply) => {
      const label = new app.objection.models.label();
      return reply.render('labels/new', { label });
    })

  .get('/labels/:id/edit',
    { preValidation: app.authenticate },
    async (req, reply) => {
      const label = await app.objection.models.label.query().findById(req.params.id);
      return reply.render('labels/edit', { label });
    })

  .post('/labels', async (req, reply) => {
    try {
      await app.objection.models.label.query().insert(req.body.data);

      req.flash('info', i18next.t('flash.labels.create.success'));
      return reply.redirect(app.reverse('labels'));
    } catch ({ data }) {
      req.flash('error', i18next.t('flash.labels.create.error'));
      return reply.render('labels/new', { labels: req.body.data, errors: data });
    }
  })

  .patch('/labels/:id', async (req, reply) => {
    try {
      const label = await app.objection.models.label.query().findById(req.params.id);
      await label.$query().update(req.body.data);

      req.flash('info', i18next.t('flash.labels.update.success'));
      return reply.redirect(app.reverse('labels'));
    } catch ({ data }) {
      req.flash('error', i18next.t('flash.labels.update.error'));
      return reply.render('labels/edit', { label: req.body.data, errors: data });
    }
  })

  .delete('/labels/:id', { name: 'deleteLabel' }, async (req, reply) => {
    const tasks = await app.objection.models.label
      .relatedQuery('tasks')
      .for(req.params.id);

    if (tasks.length) {
      req.flash('error', i18next.t('flash.labels.delete.error'));
    } else {
      await app.objection.models.label.query().deleteById(req.params.id);
      req.flash('info', i18next.t('flash.labels.delete.success'));
    }

    return reply.redirect(app.reverse('labels'));
  });
