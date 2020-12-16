import _ from 'lodash';
import getApp from '../server/index.js';
import encrypt from '../server/lib/secure.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test users CRUD', () => {
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
      url: app.reverse('users'),
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
    const existingUserData = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: existingUserData,
      },
    });

    expect(response.statusCode).toBe(302);

    const expected = {
      ..._.omit(existingUserData, 'password'),
      passwordDigest: encrypt(existingUserData.password),
    };
    const user = await models.user.query().findOne({ email: existingUserData.email });
    expect(user).toMatchObject(expected);
  });

  it('update', async () => {
    const existingUserData = testData.users.existing;
    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: existingUserData,
      },
    });

    expect(responseSignIn.statusCode).toBe(302);

    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    const cookie = { [name]: value };

    const { id } = await models.user.query().findOne({ email: existingUserData.email });
    const dataForUpdate = testData.users.updateData;
    const responseUpdateUser = await app.inject({
      method: 'PATCH',
      url: `/users/${id}`,
      payload: {
        data: { ...existingUserData, ...dataForUpdate },
      },
      cookies: cookie,
    });

    expect(responseUpdateUser.statusCode).toBe(302);

    const expected = await models.user.query().findOne({ email: dataForUpdate.email });
    expect(expected).toMatchObject(_.omit({ ...existingUserData, ...dataForUpdate }, 'password'));
  });

  it('delete', async () => {
    const existingUserData = testData.users.existing;
    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: existingUserData,
      },
    });

    expect(responseSignIn.statusCode).toBe(302);

    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    const cookie = { [name]: value };

    const { id } = await models.user.query().findOne({ email: existingUserData.email });
    const responseDeleteUser = await app.inject({
      method: 'DELETE',
      url: `/users/${id}`,
      cookies: cookie,
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
