import getApp from '../server/index.js';
import {
  getTestData, prepareData, singIn,
} from './helpers/index.js';

describe('test statuses CRUD', () => {
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
      url: app.reverse('statuses'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const statusData = testData.statuses.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: {
        data: statusData,
      },
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);

    const expected = await models.status.query().findOne({ name: statusData.name });
    expect(expected).toMatchObject(statusData);
  });

  it('edit', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editStatus', { id: 1 }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('update', async () => {
    const statusData = testData.statuses.updateData;
    const { id } = await models.status.query().findOne({ name: testData.statuses.existing.name });
    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('patchStatus', { id }),
      payload: {
        data: statusData,
      },
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);

    const expected = await models.status.query().findOne({ name: statusData.name });
    expect(expected).toMatchObject(statusData);
  });

  it('delete', async () => {
    const statusData = testData.statuses.existing;
    const { id } = await models.status.query().findOne({ name: statusData.name });
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteStatus', { id }),
      cookies: cookie,
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
