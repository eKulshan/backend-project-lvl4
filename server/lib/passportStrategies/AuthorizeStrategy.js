import { Strategy } from 'fastify-passport';

export default class AuthorizeStrategy extends Strategy {
  constructor(name, app) {
    super(name);
    this.app = app;
  }

  async authenticate(request) {
    if (!request.isAuthenticated()) {
      return this.fail();
    }

    const { id = request.user.id } = request.params;
    if (Number(id) === request.user.id) {
      return this.pass();
    }
    return this.fail();
  }
}
