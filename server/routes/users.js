// @ts-check

// import async from 'async';
import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (_req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })

    .get('/users/new', { name: 'newUser' }, (_req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })

    .get('/users/:id/edit', { name: 'editUser' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('users'));
        return reply;
      }

      const { id } = req.params;
      const userId = req.user.id;

      if (Number(id) !== Number(userId)) {
        req.flash('error', i18next.t('flash.users.update.notAllowed'));
        return reply.redirect(app.reverse('users'));
      }
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
        const user = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(user);

        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user: req.body.data, errors: data });
        return reply;
      }
    })

    .patch('/users/:id', async (req, reply) => {
      const { id } = req.params;
      const userId = req.user.id;
      if (Number(id) !== Number(userId)) {
        req.flash('error', i18next.t('flash.authErros'));
        return reply.redirect(app.reverse('users'));
      }
      try {
        const user = await app.objection.models.user.fromJson(req.body.data);
        const currentUser = await app.objection.models.user.query().findById(req.params.id);
        await currentUser.$query().update(user);
        req.flash('info', i18next.t('flash.users.update.success'));
        reply.redirect(app.reverse('users'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.update.error'));
        reply.render('users/edit', { user: req.body.data, errors: data });
        return reply;
      }
    })

    .delete('/users/:id', { name: 'deleteUser' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('users'));
        return reply;
      }

      const { id } = req.params;
      const userId = req.user.id;

      if (Number(id) !== Number(userId)) {
        req.flash('error', i18next.t('flash.users.delete.notAllowed'));
        return reply.redirect(app.reverse('users'));
      }
      try {
        await app.objection.models.user.query().deleteById(req.params.id);
        req.logOut();
        req.flash('info', i18next.t('flash.users.delete.success'));
        return reply.redirect(app.reverse('root'));
      } catch (err) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        return reply.redirect(app.reverse('users'));
      }
    });
};
