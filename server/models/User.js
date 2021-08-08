import { Model } from 'objection';
import path from 'path';
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
      required: ['firstName', 'lastName', 'email', 'password'],
      properties: {
        id: { type: 'integer' },
        firstName: { type: 'string', minLength: 1 },
        lastName: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 3 },
      },
    };
  }

  static relationMappings = {
    executedTasks: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'Task'),
      join: {
        from: 'user.id',
        to: 'tasks.executorId',
      },
    },
    createdTasks: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'Task'),
      join: {
        from: 'user.id',
        to: 'tasks.creatorId',
      },
    },
  };

  set password(value) {
    this.passwordDigest = encrypt(value);
  }

  verifyPassword(password) {
    return encrypt(password) === this.passwordDigest;
  }
}
