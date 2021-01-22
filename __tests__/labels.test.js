import getApp from '../server/index.js';
import {
  getTestData, prepareData, logInUser, getCookie,
} from './helpers/index.js';

describe('test labels CRUD', () => {
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
      url: app.reverse('labels'),
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
    const newStatusData = testData.labels.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      payload: {
        data: newStatusData,
      },
      cookies: getCookie(await logInUser(app, testData.users.existing)),
    });
    expect(response.statusCode).toBe(302);

    const expected = { ...newStatusData };
    const labels = await models.label.query().findOne({ name: newStatusData.name });
    expect(labels).toMatchObject(expected);
  });

  it('update', async () => {
    const dataForUpdate = testData.labels.updateData;
    const { id } = await models.label.query().findOne({ name: testData.labels.existing.name });
    const response = await app.inject({
      method: 'PATCH',
      url: `/labels/${id}`,
      payload: {
        data: { ...dataForUpdate },
      },
      cookies: getCookie(await logInUser(app, testData.users.existing)),
    });
    expect(response.statusCode).toBe(302);

    const expected = await models.label.query().findOne({ name: dataForUpdate.name });
    expect(expected).toMatchObject(dataForUpdate);
  });

  it('delete', async () => {
    const existingStatusData = testData.labels.existing;
    const { id } = await models.label.query().findOne({ name: existingStatusData.name });
    const response = await app.inject({
      method: 'DELETE',
      url: `/labels/${id}`,
      cookies: getCookie(await logInUser(app, testData.users.existing)),
    });
    expect(response.statusCode).toBe(302);

    const expected = await models.label.query().findById(id);
    expect(expected).toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
