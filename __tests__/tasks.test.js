import getApp from '../server/index.js';
import {
  getTestData, prepareData, logInUser, getCookie,
} from './helpers/index.js';

describe('test tasks CRUD', () => {
  let app;
  let knex;
  let models;
  let testData;

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    models = app.objection.models;
    testData = getTestData();
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
  });

  it('read', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
      cookies: getCookie(await logInUser(app, testData.users.existing)),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies: getCookie(await logInUser(app, testData.users.existing)),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const newTaskData = testData.tasks.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: newTaskData,
      },
      cookies: getCookie(await logInUser(app, testData.users.existing)),
    });
    expect(response.statusCode).toBe(302);

    const expected = testData.tasks.expectedNew;
    const task = await models.task.query().findOne({ name: newTaskData.name });
    expect(task).toMatchObject(expected);
  });

  it('update', async () => {
    const { updateData } = testData.tasks;
    const { id } = await models.task.query().findOne({ name: testData.tasks.existing.name });
    const response = await app.inject({
      method: 'PATCH',
      url: `/tasks/${id}`,
      payload: {
        data: { ...updateData },
      },
      cookies: getCookie(await logInUser(app, testData.users.existing)),
    });
    expect(response.statusCode).toBe(302);

    const expected = testData.tasks.expectedUpdatedData;
    const task = await models.task.query().findOne({ name: updateData.name });
    expect(task).toMatchObject(expected);
  });

  it('delete', async () => {
    const existingTaskData = testData.tasks.existing;
    const { id } = await models.task.query().findOne({ name: existingTaskData.name });
    const response = await app.inject({
      method: 'DELETE',
      url: `/tasks/${id}`,
      cookies: getCookie(await logInUser(app, testData.users.existing)),
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
