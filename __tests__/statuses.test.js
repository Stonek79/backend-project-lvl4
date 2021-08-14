import getApp from '../server/index.js';
import { fakeTask, fakeStatus } from './helpers/index.js';

describe('test statuses CRUD', () => {
  let app;
  let knex;
  let status;
  let models;
  let testData;

  beforeAll(async () => {
    app = await getApp();
    models = app.objection.models;
    knex = app.objection.knex;
    testData = fakeStatus();
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    status = await models.status.query().insert(testData);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('statuses'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/statuses/new',
    });

    expect(response.statusCode).toBe(200);
  });

  it('create status', async () => {
    const newStatus = fakeStatus();

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: {
        data: newStatus,
      },
    });

    expect(response.statusCode).toBe(302);

    const createdStatus = await models.status.query().findOne({ name: newStatus.name });

    expect(createdStatus).toMatchObject(newStatus);
  });

  it('edit status', async () => {
    const newStatus = fakeStatus();

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('patchStatus', { id: status.id }),
      payload: {
        data: newStatus,
      },
    });

    expect(response.statusCode).toBe(302);

    const updatedStatus = await models.status.query().findById(status.id);

    expect(updatedStatus).toMatchObject(newStatus);
  });

  it('delete status', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteStatus', { id: status.id.toString() }),
    });

    expect(response.statusCode).toBe(302);

    const deletedStatus = await models.label.query().findById(status.id);

    expect(deletedStatus).toBeUndefined();
  });

  it('delete status linked with task', async () => {
    await models.task.query().insert({
      ...fakeTask(),
      statusId: status.id,
    });

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteStatus', { id: status.id.toString() }),
    });

    expect(response.statusCode).toBe(302);

    const undeletedStatus = await models.status.query().findById(status.id.toString());

    expect(undeletedStatus).not.toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    app.close();
  });
});
