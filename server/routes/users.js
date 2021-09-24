// @ts-check

import i18next from 'i18next';

export default (app) => {
  const isAllowed = async (req, res) => {
    if (Number(req.params.id) !== Number(req.user.id)) {
      req.flash('error', i18next.t('flash.users.update.notAllowed'));
      return res.redirect(app.reverse('users'));
    }
    return null;
  };
  app
    .get('/users', { name: 'users' }, async (_req, reply) => {
      const users = await app.objection.models.user.query();
      return reply.render('users/index', { users });
    })

    .get('/users/new',
      { name: 'newUser', preValidation: app.authenticate },
      (_req, reply) => {
        const user = new app.objection.models.user();
        return reply.render('users/new', { user });
      })

    .get('/users/:id/edit',
      { name: 'editUser', preValidation: app.authenticate, preHandler: isAllowed },
      async (req, reply) => {
        try {
          const user = await app.objection.models.user.query().findById(req.params.id);
          return reply.render('users/edit', { user });
        } catch (err) {
          req.flash('error', i18next.t('flash.users.update.notFound'));
          return reply.redirect(app.reverse('users'));
        }
      })

    .post('/users', async (req, reply) => {
      try {
        await app.objection.models.user.query().insert(req.body.data);

        req.flash('info', i18next.t('flash.users.create.success'));
        return reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        return reply.render('users/new', { user: req.body.data, errors: data });
      }
    })

    .patch('/users/:id', async (req, reply) => {
      try {
        const currentUser = await app.objection.models.user.query().findById(req.params.id);
        await currentUser.$query().update(req.body.data);

        req.flash('info', i18next.t('flash.users.update.success'));
        return reply.redirect(app.reverse('users'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.update.error'));
        const user = await app.objection.models.user.query().findById(req.params.id);

        return reply.render('users/edit', { user, errors: data });
      }
    })

    .delete('/users/:id',
      { name: 'deleteUser', preValidation: app.authenticate, preHandler: isAllowed },
      async (req, reply) => {
        const tasks = await app.objection.models.task
          .query()
          .where('executorId', req.params.id)
          .orWhere('creatorId', req.params.id);

        if (!tasks.length) {
          await app.objection.models.user.query().deleteById(req.params.id);
          req.logOut();
          req.flash('info', i18next.t('flash.users.delete.success'));
        } else {
          req.flash('error', i18next.t('flash.users.delete.error'));
        }

        return reply.redirect(app.reverse('users'));
      });
};
