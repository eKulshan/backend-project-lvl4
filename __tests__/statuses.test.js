import getApp from '../server/index.js';
import {
  getTestData, prepareData, logInUser, getCookie,
} from './helpers/index.js';

describe('test statuses CRUD', () => {
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
      url: app.reverse('statuses'),
      cookies: getCookie(await logInUser(app, testData.users.existing)),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
      cookies: getCookie(await logInUser(app, testData.users.existing)),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const newStatusData = testData.statuses.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: {
        data: newStatusData,
      },
      cookies: getCookie(await logInUser(app, testData.users.existing)),
    });
    expect(response.statusCode).toBe(302);

    const expected = { ...newStatusData };
    const status = await models.status.query().findOne({ name: newStatusData.name });
    expect(status).toMatchObject(expected);
  });

  it('update', async () => {
    const dataForUpdate = testData.statuses.updateData;
    const { id } = await models.status.query().findOne({ name: testData.statuses.existing.name });
    const response = await app.inject({
      method: 'PATCH',
      url: `/statuses/${id}`,
      payload: {
        data: { ...dataForUpdate },
      },
      cookies: getCookie(await logInUser(app, testData.users.existing)),
    });
    expect(response.statusCode).toBe(302);

    const expected = await models.status.query().findOne({ name: dataForUpdate.name });
    expect(expected).toMatchObject(dataForUpdate);
  });

  it('delete', async () => {
    const existingStatusData = testData.statuses.existing;
    const { id } = await models.status.query().findOne({ name: existingStatusData.name });
    const response = await app.inject({
      method: 'DELETE',
      url: `/statuses/${id}`,
      cookies: getCookie(await logInUser(app, testData.users.existing)),
    });
    expect(response.statusCode).toBe(302);

    const expected = await models.status.query().findById(id);
    expect(expected).toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
