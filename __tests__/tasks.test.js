import getApp from '../server/index.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test tasks CRUD', () => {
  let app;
  let knex;
  let models;
  let testData;
  const logInUser = async () => {
    const userData = testData.users.existing;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: userData,
      },
    });
    return response;
  };

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
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const responseUserLogIn = await logInUser();
    expect(responseUserLogIn.statusCode).toBe(302);

    const [sessionCookie] = responseUserLogIn.cookies;
    const { name, value } = sessionCookie;
    const cookie = { [name]: value };

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const responseUserLogIn = await logInUser();
    expect(responseUserLogIn.statusCode).toBe(302);

    const [sessionCookie] = responseUserLogIn.cookies;
    const { name, value } = sessionCookie;
    const cookie = { [name]: value };

    const newTaskData = testData.tasks.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: newTaskData,
      },
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);

    const expected = testData.tasks.expectedNew;
    const task = await models.task.query().findOne({ name: newTaskData.name });
    expect(task).toMatchObject(expected);
  });

  it('update', async () => {
    const responseUserLogIn = await logInUser();
    expect(responseUserLogIn.statusCode).toBe(302);

    const [sessionCookie] = responseUserLogIn.cookies;
    const { name, value } = sessionCookie;
    const cookie = { [name]: value };

    const { updateData } = testData.tasks;
    const { id } = await models.task.query().findOne({ name: testData.tasks.existing.name });
    const response = await app.inject({
      method: 'PATCH',
      url: `/tasks/${id}`,
      payload: {
        data: { ...updateData },
      },
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);

    const expected = testData.tasks.expectedUpdatedData;
    const task = await models.task.query().findOne({ name: updateData.name });
    expect(task).toMatchObject(expected);
  });

  it('delete', async () => {
    const responseUserLogIn = await logInUser();
    expect(responseUserLogIn.statusCode).toBe(302);

    const [sessionCookie] = responseUserLogIn.cookies;
    const { name, value } = sessionCookie;
    const cookie = { [name]: value };

    const existingTaskData = testData.tasks.existing;
    const { id } = await models.task.query().findOne({ name: existingTaskData.name });
    const response = await app.inject({
      method: 'DELETE',
      url: `/tasks/${id}`,
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
