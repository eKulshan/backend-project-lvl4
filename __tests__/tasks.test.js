import getApp from '../server/index.js';
import {
  getTestData, prepareData, singIn,
} from './helpers/index.js';

describe('test tasks CRUD', () => {
  let app;
  let knex;
  let models;
  let testData;
  let cookie;

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    models = app.objection.models;
    testData = getTestData();
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
    cookie = await singIn(app, testData.users.existing);
  });

  it('read', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const taskData = testData.tasks.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: taskData,
      },
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);
    const expected = await models.task.query().findOne({ name: taskData.name }).withGraphFetched('labels');
    expect(expected).toMatchObject(testData.tasks.expectedNew);
  });

  it('edit', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editTask', { id: 1 }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('update', async () => {
    const { updateData } = testData.tasks;
    const { id } = await models.task.query().findOne({ name: testData.tasks.existing.name });
    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('patchTask', { id }),
      payload: {
        data: { ...updateData },
      },
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);

    const expected = await models.task.query().findOne({ name: updateData.name }).withGraphFetched('labels');
    expect(expected).toMatchObject(testData.tasks.expectedUpdated);
  });

  it('delete', async () => {
    const existingTaskData = testData.tasks.existing;
    const { id } = await models.task.query().findOne({ name: existingTaskData.name });
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteTask', { id }),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);

    const expected = await models.task.query().findById(id);
    expect(expected).toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
