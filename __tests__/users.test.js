// @ts-check

import _ from 'lodash';
import getApp from '../server/index.js';
import encrypt from '../server/lib/secure.js';
import { getTestData, prepareData, signIn } from './helpers/index.js';

describe('test users CRUD', () => {
  let app;
  let knex;
  let models;
  let user;
  let testData;
  let cookies;

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    models = app.objection.models;
    testData = getTestData();
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
    user = await models.user.query().insert(testData.users.existing);
    cookies = await signIn(app, testData.users.existing);
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

  it('create user', async () => {
    const newUser = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: newUser,
      },
      cookies,
    });

    expect(response.statusCode).toBe(302);

    const expected = {
      ..._.omit(newUser, 'password'),
      passwordDigest: encrypt(newUser.password),
    };

    const testUser = await models.user.query().findOne({ email: newUser.email });
    expect(testUser).toMatchObject(expected);
  });

  it('edit user', async () => {
    const newUser = testData.users.new;
    const response = await app.inject({
      method: 'PATCH',
      url: `/users/${user.id}`,
      payload: {
        data: newUser,
      },
      cookies,
    });

    expect(response.statusCode).toBe(302);

    const expected = {
      ..._.omit(newUser, 'password'),
      passwordDigest: encrypt(newUser.password),
    };

    const editedUser = await models.user.query().findOne({ email: newUser.email });

    expect(editedUser).toMatchObject(expected);
  });

  it('delete user', async () => {
    const response = await app.inject({
      method: 'DELETE',
      cookies,
      url: app.reverse('deleteUser', { id: user.id }),
    });

    expect(response.statusCode).toBe(302);
  });

  it('create user with empty field', async () => {
    const newUser = testData.users.new;

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: { ...newUser, firstName: '', lastName: '' },
      },
      cookies,
    });

    expect(response.statusCode).toBe(200);

    const falsCreatedUser = await models.user.query().findOne({ email: newUser.email });
    expect(falsCreatedUser).toBeUndefined();
  });

  it('create user with the same email', async () => {
    const newUser = testData.users.new;

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: { ...newUser, email: user.email },
      },
      cookies,
    });

    expect(response.statusCode).toBe(200);

    const falseCreatedUser = await models.user.query().findOne({ email: newUser.email });
    expect(falseCreatedUser).toBeUndefined();
  });

  it('update user with empty password', async () => {
    const newUser = testData.users.new;

    const { statusCode } = await app.inject({
      method: 'PATCH',
      url: `/users/${user.id}`,
      payload: {
        data: { ...newUser, password: '' },
      },
      cookies,
    });

    expect(statusCode).toBe(200);

    const unupdatedUser = await models.user.query().findOne({ email: newUser.email });
    expect(unupdatedUser).toBeUndefined();
  });

  it('delete user with tasks', async () => {
    await models.task.query().insert({
      ...testData.tasks.new,
      creatorId: user.id,
    });

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteUser', { id: user.id }),
      cookies,
    });

    expect(response.statusCode).toBe(302);

    const undeletedUser = await models.user.query().findById(user.id);

    expect(undeletedUser).not.toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
