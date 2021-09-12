import getApp from '../server/index.js';
import { getTestData, prepareData, signIn } from './helpers/index.js';

describe('test tasks CRUD', () => {
  let app;
  let knex;
  let models;
  let task;
  let testData;
  let cookies;
  let user;

  beforeAll(async () => {
    app = await getApp();
    models = app.objection.models;
    knex = app.objection.knex;
    testData = getTestData();
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
    user = await models.user.query().insert(testData.users.existing);
    task = await models.task.query().insert({ ...testData.tasks.existing, creatorId: user.id });
    cookies = await signIn(app, testData.users.existing);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      cookies,
      url: app.reverse('tasks'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      cookies,
      url: app.reverse('newTask'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('task info', async () => {
    const response = await app.inject({
      method: 'GET',
      cookies,
      url: app.reverse('newTask', { id: `${task.id}` }),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create task', async () => {
    const response = await app.inject({
      method: 'POST',
      cookies,
      url: app.reverse('tasks'),
      payload: {
        data: testData.tasks.new,
      },
    });

    expect(response.statusCode).toBe(302);

    const createdTask = await models.task.query().findOne({ name: testData.tasks.new.name });

    expect(createdTask).not.toBeUndefined();
  });

  it('create task without executor', async () => {
    const newTask = { ...testData.tasks.new, executorId: '' };
    const response = await app.inject({
      method: 'POST',
      cookies,
      url: app.reverse('tasks'),
      payload: {
        data: newTask,
      },
    });

    expect(response.statusCode).toBe(302);

    const createdTask = await models.task.query().findOne({ name: newTask.name });

    expect(createdTask).not.toBeUndefined();
  });

  it('edit task', async () => {
    const newTask = { ...testData.tasks.new, creatorId: user.id };

    const { id } = await models.task.query().findOne({ name: task.name });

    const response = await app.inject({
      method: 'PATCH',
      cookies,
      url: app.reverse('updateTask', { id }),
      payload: {
        data: newTask,
      },
    });

    expect(response.statusCode).toBe(302);

    const updatedTask = await models.task.query().findOne({ name: newTask.name });

    expect(updatedTask).not.toBeUndefined();
  });

  it('delete task', async () => {
    const response = await app.inject({
      method: 'DELETE',
      cookies,
      url: app.reverse('deleteTask', { id: task.id }),
    });

    expect(response.statusCode).toBe(302);

    const deletedTask = await models.task.query().findById(task.id);

    expect(deletedTask).toBeUndefined();
  });

  it('can\'t delete other user task', async () => {
    const otherTask = await models.task.query().findById(1);
    const response = await app.inject({
      method: 'DELETE',
      cookies,
      url: app.reverse('deleteTask', { id: otherTask.id }),
    });

    expect(response.statusCode).toBe(302);

    const undeletedTask = await models.task.query().findById(otherTask.id);

    expect(undeletedTask).toMatchObject(otherTask);
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
