import getApp from '../server/index.js';
import {
  getTestData, prepareData, singIn,
} from './helpers/index.js';

describe('test labels CRUD', () => {
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
      url: app.reverse('labels'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newLabel'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const labelData = testData.labels.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      payload: {
        data: labelData,
      },
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);

    const expected = await models.label.query().findOne({ name: labelData.name });
    expect(expected).toMatchObject(labelData);
  });

  it('edit', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editLabel', { id: 1 }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('update', async () => {
    const labelData = testData.labels.updateData;
    const { id } = await models.label.query().findOne({ name: testData.labels.existing.name });
    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('patchLabel', { id }),
      payload: {
        data: labelData,
      },
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);

    const expected = await models.label.query().findOne({ name: labelData.name });
    expect(expected).toMatchObject(labelData);
  });

  it('delete', async () => {
    const labelData = testData.labels.existing;
    const { id } = await models.label.query().findOne({ name: labelData.name });
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteLabel', { id }),
      cookies: cookie,
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
