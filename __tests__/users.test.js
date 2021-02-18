import _ from 'lodash';
import getApp from '../server/index.js';
import encrypt from '../server/lib/secure.js';
import {
  getTestData, prepareData, getCookie,
} from './helpers/index.js';

describe('test users CRUD', () => {
  let app;
  let knex;
  let models;
  let testData;
  let cookies;

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    models = app.objection.models;
    testData = getTestData();
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
    cookies = await getCookie(app, testData.users.existing);
  });

  it('read', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('users'),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newUser'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: testData.users.new,
      },
    });
    expect(response.statusCode).toBe(302);

    const expected = {
      ..._.omit(testData.users.new, 'password'),
      passwordDigest: encrypt(testData.users.new.password),
    };
    const user = await models.user.query().findOne({ email: testData.users.new.email });
    expect(user).toMatchObject(expected);
  });

  it('edit', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editUser', { id: 1 }),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('update', async () => {
    const { id } = await models.user.query().findOne({ email: testData.users.existing.email });
    const responseUpdateUser = await app.inject({
      method: 'PATCH',
      url: app.reverse('patchUser', { id }),
      payload: {
        data: { ...testData.users.existing, ...testData.users.updateData },
      },
      cookies,
    });
    expect(responseUpdateUser.statusCode).toBe(302);

    const expected = await models.user.query().findOne({ email: testData.users.updateData.email });
    expect(expected).toMatchObject(_.omit({
      ...testData.users.existing,
      ...testData.users.updateData,
      passwordDigest: encrypt(testData.users.updateData.password),
    }, 'password'));
  });

  it('delete', async () => {
    const { id } = await models.user.query().findOne({ email: testData.users.existing.email });
    const responseDeleteUser = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteUser', { id }),
      cookies,
    });
    expect(responseDeleteUser.statusCode).toBe(302);

    const expected = await models.user.query().findById(id);
    expect(expected).toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
