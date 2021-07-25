// @ts-check

import i18next from 'i18next';

export default (app) => {
  const isAllowed = async (req, res) => {
    if (Number(req.params.id) !== Number(req.user.id)) {
      req.flash('error', i18next.t('flash.statuses.update.notAllowed'));
      return res.redirect(app.reverse('statuses'));
    }
    return null;
  };

  app
    .get('/statuses', { name: 'statuses' }, async (_req, reply) => {
      const statuses = await app.objection.models.status.query();
      return reply.render('statuses/index', { statuses });
    })
    .get('/statuses/new', { name: 'newStatus', preValidation: app.authenticate }, (_req, reply) => {
      const status = new app.objection.models.status();
      return reply.render('statuses/new', { status });
    })
    .get('/statuses/:id/edit', { name: 'editStatus', preValidation: app.authenticate, preHandler: isAllowed }, async (req, reply) => {
      const status = await app.objection.models.status.query().findById(req.params.id);
      return reply.render('statuses/edit', { status });
    })
    .post('/statuses', async (req, reply) => {
      try {
        const status = await app.objection.models.status.fromJson(req.body.data);
        await app.objection.models.status.query().insert(status);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        return reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        return reply.render('statuses/new', { status: req.body.data, errors: data });
      }
    })
    .patch('/statuses/:id', async (req, reply) => {
      try {
        const currentStatus = await app.objection.status.fromJson(req.body.data);
        const status = await app.objection.status.query().findById(req.params.id);
        await status.$query().update(currentStatus);
        req.flash('info', i18next.t('flash.statuses.edit.success'));
        return reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.edit.error'));
        return reply.render('statuses/edit', { status: req.body.data, errors: data });
      }
    })
    .delete('/statuses/:id', { name: 'deleteStatus', preValidation: app.authenticate, preHandler: isAllowed }, async (req, reply) => {
    //   const tasks = await app.objection.models.status.relatedQuery('tasks').for(req.params.id);
    // TODO доработать с тасками
      // if (tasks.length) {
      //   req.flash('error', i18next.t('flash.statuses.delete.error'));
      // } else {
      await app.objection.models.status.query().deleteById(req.params.id);
      // req.flash('info', i18next.t('flash.statuses.delete.success'));
      // }

      reply.redirect(app.reverse('statuses'));
    });
};
