import { Model } from 'objection';
import path from 'path';
import objectionUnique from 'objection-unique';

const unique = objectionUnique({ fields: ['name'] });

export default class Status extends unique(Model) {
  static get tableName() {
    return 'statuses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    };
  }

  static relationMappings = {
    tasks: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'Task'),
      join: {
        from: 'statuses.id',
        to: 'tasks.statusId',
      },
    },
  };
}
