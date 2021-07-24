// @ts-check

import _ from 'lodash';
import getApp from '../server/index.js';
import encrypt from '../server/lib/secure.js';
import fakeUser from './helpers/index.js';

describe('test users CRUD', () => {
  let app;
  let knex;
  let models;
  let user;

  const testData = fakeUser();

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    models = app.objection.models;

    app.addHook('preHandler', async (req) => {
      req.user = await models.user.query().findOne({ email: user.email });
    });
  });

  beforeEach(async () => {
    // тесты не должны зависеть друг от друга
    // перед каждым тестом выполняем миграции
    // и заполняем БД тестовыми данными
    await knex.migrate.latest();
    user = await models.user.query().insert(testData);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('users'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newUser'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const newUser = fakeUser();
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: newUser,
      },
    });

    expect(response.statusCode).toBe(302);

    const expected = {
      ..._.omit(newUser, 'password'),
      passwordDigest: encrypt(newUser.password),
    };

    const testUser = await models.user.query().findOne({ email: newUser.email });
    expect(testUser).toMatchObject(expected);
  });

  it('edit', async () => {
    const newUser = fakeUser();
    const response = await app.inject({
      method: 'PATCH',
      url: `/users/${user.id}`,
      payload: {
        data: newUser,
      },
    });

    expect(response.statusCode).toBe(302);

    const expected = {
      ..._.omit(newUser, 'password'),
      passwordDigest: encrypt(newUser.password),
    };

    const editedUser = await models.user.query().findOne({ email: newUser.email });
    expect(editedUser).toMatchObject(expected);
  });

  test('delete', async () => {
    user = await models.user.query().insert(fakeUser());
    const { id } = user;
    const response = await app.inject({
      method: 'DELETE',
      url: `/users/${id}`,
    });

    expect(response.statusCode).toBe(302);

    const result = await models.user.query().findById(id);

    expect(result).toBeUndefined();
  });

  describe('negative case', () => {
    test('create with empty field', async () => {
      const newUser = fakeUser();

      const response = await app.inject({
        method: 'POST',
        url: app.reverse('users'),
        payload: {
          data: { ...newUser, firstName: '', lastName: '' },
        },
      });

      expect(response.statusCode).toBe(200);

      const falsCreatedUser = await models.user.query().findOne({ email: newUser.email });
      expect(falsCreatedUser).toBeUndefined();
    });

    test('create with same email', async () => {
      const newUser = fakeUser();

      const response = await app.inject({
        method: 'POST',
        url: app.reverse('users'),
        payload: {
          data: { ...newUser, email: user.email },
        },
      });

      expect(response.statusCode).toBe(200);

      const falseCreatedUser = await models.user.query().findOne({ email: newUser.email });
      expect(falseCreatedUser).toBeUndefined();
    });

    test('update with no password', async () => {
      const newUser = fakeUser();

      const { statusCode } = await app.inject({
        method: 'PATCH',
        url: `/users/${user.id}`,
        payload: {
          data: { ...newUser, password: '' },
        },
      });

      expect(statusCode).toBe(200);

      const unupdatedUser = await models.user.query().findOne({ email: newUser.email });
      expect(unupdatedUser).toBeUndefined();
    });
  });

  afterEach(async () => {
    // после каждого теста откатываем миграции
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
