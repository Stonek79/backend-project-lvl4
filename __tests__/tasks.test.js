import getApp from '../server/index.js';
import { fakeTask, fakeStatus, fakeUser } from './helpers/index.js';

describe('test tasks CRUD', () => {
  let app;
  let knex;
  let models;
  let status;
  let task;
  let user;
  let statusData;
  let testData;
  let userData;

  beforeAll(async () => {
    app = await getApp();
    models = app.objection.models;
    knex = app.objection.knex;
    statusData = fakeStatus();
    testData = fakeTask();
    userData = fakeUser();

    app.addHook('preHandler', async (req) => {
      req.user = await models.user.query().findOne({ email: user.email });
    });
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    user = await models.user.query().insert(userData);
    status = await models.status.query().insert(statusData);
    task = await models.task.query().insert({
      ...testData,
      creatorId: user.id,
      executorId: `${user.id}`,
      statusId: `${status.id}`,
    });
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('task info', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask', { id: `${task.id}` }),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create task', async () => {
    const newTask = fakeTask();
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: newTask,
      },
    });

    expect(response.statusCode).toBe(302);

    const createdTask = await models.task.query().findOne({ name: newTask.name });

    expect(createdTask).toMatchObject(newTask);
  });

  it('edit task', async () => {
    const { name, description } = fakeTask();
    const newTask = { ...task, name, description };

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateTask', { id: task.id }),
      payload: {
        data: { ...task, name, description },
      },
    });

    expect(response.statusCode).toBe(302);

    const updatedTask = await models.task.query().findById(task.id);

    expect(updatedTask).toMatchObject(newTask);
  });

  it('delete task', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteTask', { id: task.id }),
    });

    expect(response.statusCode).toBe(302);

    const deletedTask = await models.task.query().findById(task.id);

    expect(deletedTask).toBeUndefined();
  });

  it('delete other user task', async () => {
    const otherUserTask = await models.task.query().insert({
      ...fakeTask(),
      executorId: '2',
      creatorId: 2,
      statusId: `${status.id}`,
    });

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteTask', { id: otherUserTask.id }),
    });

    expect(response.statusCode).toBe(302);

    const undeletedTask = await models.task.query().findById(otherUserTask.id);

    expect(undeletedTask).toMatchObject(otherUserTask);
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
