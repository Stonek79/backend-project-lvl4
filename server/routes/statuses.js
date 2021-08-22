// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses' }, async (_req, reply) => {
      const statuses = await app.objection.models.status.query();
      return reply.render('statuses/index', { statuses });
    })

    .get('/statuses/new',
      { name: 'newStatus' },
      (_req, reply) => {
        const status = new app.objection.models.status();
        return reply.render('statuses/new', { status });
      })

    .get('/statuses/:id/edit',
      { name: 'editStatus', preValidation: app.authenticate },
      async (req, reply) => {
        const status = await app.objection.models.status.query().findById(req.params.id);
        return reply.render('statuses/edit', { status });
      })

    .post('/statuses', async (req, reply) => {
      const { models } = await app.objection;
      try {
        const status = await models.status.fromJson(req.body.data);
        await models.status.query().insert(status);

        req.flash('info', i18next.t('flash.statuses.create.success'));
        return reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        return reply.render('statuses/new', { status: req.body.data, errors: data });
      }
    })

    .patch('/statuses/:id', { name: 'patchStatus' }, async (req, reply) => {
      const { models } = await app.objection;
      try {
        const currentStatus = await models.status.fromJson(req.body.data);
        const status = await models.status.query().findById(req.params.id);
        await status.$query().update(currentStatus);

        req.flash('info', i18next.t('flash.statuses.update.success'));
        return reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.update.error'));
        return reply.code(422).render('statuses/edit', { status: req.body.data, errors: data });
      }
    })

    .delete('/statuses/:id', { name: 'deleteStatus' }, async (req, reply) => {
      const { models } = await app.objection;
      const tasks = await models.status
        .relatedQuery('tasks')
        .for(req.params.id);

      if (tasks.length) {
        req.flash('error', i18next.t('flash.statuses.delete.error'));
      } else {
        await models.status.query().deleteById(req.params.id);
        req.flash('info', i18next.t('flash.statuses.delete.success'));
      }

      return reply.redirect(app.reverse('statuses'));
    });
};
