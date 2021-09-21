import getApp from '../server/index.js';
import { getTestData, prepareData, signIn } from './helpers/index.js';

describe('test statuses CRUD', () => {
  let app;
  let knex;
  let status;
  let models;
  let testData;
  let cookies;

  beforeAll(async () => {
    app = await getApp();
    models = app.objection.models;
    knex = app.objection.knex;
    testData = getTestData();
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
    status = await models.status.query().findOne({ name: testData.statuses.existing.name });
    cookies = await signIn(app, testData.users.existing);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      cookies,
      url: app.reverse('statuses'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      cookies,
      url: '/statuses/new',
    });

    expect(response.statusCode).toBe(200);
  });

  it('create status', async () => {
    const newStatus = testData.statuses.new;

    const response = await app.inject({
      method: 'POST',
      cookies,
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
    const newStatus = testData.statuses.new;

    const response = await app.inject({
      method: 'PATCH',
      cookies,
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
      cookies,
      url: app.reverse('deleteStatus', { id: status.id }),
    });

    expect(response.statusCode).toBe(302);

    const deletedStatus = await models.status.query().findById(status.id);

    expect(deletedStatus).toBeUndefined();
  });

  it('delete status linked with task', async () => {
    await models.task.query().insert({
      ...testData.tasks.existing,
      statusId: status.id,
    });

    const response = await app.inject({
      method: 'DELETE',
      cookies,
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
