import getApp from '../server/index.js';
import { getTestData } from './helpers/index.js';

describe('test labels CRUD', () => {
  let app;
  let knex;
  let label;
  let models;
  let testData;

  beforeAll(async () => {
    app = await getApp();
    models = app.objection.models;
    knex = app.objection.knex;
    testData = getTestData();
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    label = await models.label.query().insert(testData.labels.existing);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('labels'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newLabel'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create label', async () => {
    const newLabel = testData.labels.new;

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      payload: {
        data: newLabel,
      },
    });

    expect(response.statusCode).toBe(302);

    const createdLabel = await models.label.query().findOne({ name: newLabel.name });

    expect(createdLabel).toMatchObject(newLabel);
  });

  it('edit label', async () => {
    const newLabel = testData.labels.new;

    const response = await app.inject({
      method: 'PATCH',
      url: `/labels/${label.id}`,
      payload: {
        data: newLabel,
      },
    });

    expect(response.statusCode).toBe(302);

    const updateLabel = await models.label.query().findById(label.id);

    expect(updateLabel).toMatchObject(newLabel);
  });

  it('delete label', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteLabel', { id: label.id }),
    });

    expect(response.statusCode).toBe(302);

    const deletedLabel = await models.label.query().findById(label.id);

    expect(deletedLabel).toBeUndefined();
  });

  it('delete label linked with task', async () => {
    const task = await models.task.query().insert(testData.tasks.existing);
    await task.$relatedQuery('labels').relate(label);

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteLabel', { id: label.id.toString() }),
    });

    expect(response.statusCode).toBe(302);

    const undeletedLabel = await models.label.query().findById(label.id);

    expect(undeletedLabel).not.toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
