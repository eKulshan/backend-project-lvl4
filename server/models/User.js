import { Model } from 'objection';
import objectionUnique from 'objection-unique';

import encrypt from '../lib/secure.js';

const unique = objectionUnique({ fields: ['email'] });

export default class User extends unique(Model) {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password', 'firstname', 'lastname'],
      properties: {
        id: { type: 'integer' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minlength: 3 },
        firstname: { type: 'string' },
        lastname: { type: 'string' },
      },
    };
  }

  set password(value) {
    this.passwordDigest = encrypt(value);
  }

  fullName() {
    return `${this.firstname} ${this.lastname}`;
  }

  verifyPassword(password) {
    return encrypt(password) === this.passwordDigest;
  }
}
