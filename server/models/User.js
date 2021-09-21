import objectionUnique from 'objection-unique';

import encrypt from '../lib/secure.js';
import BaseModel from './BaseModel.js';

const unique = objectionUnique({ fields: ['email'] });

export default class User extends unique(BaseModel) {
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

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }

  static relationMappings = {
    executedTasks: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'Task',
      join: {
        from: 'user.id',
        to: 'tasks.executorId',
      },
    },
    createdTasks: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'Task',
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
