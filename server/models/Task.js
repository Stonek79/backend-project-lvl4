import BaseModel from './BaseModel';

export default class Task extends BaseModel {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId', 'creatorId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        statusId: { type: 'integer', minimum: 1 },
        creatorId: { type: 'integer' },
        executorId: { type: ['integer', null] },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    };
  }

  static get relationMappings() {
    return {
      status: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'Status',
        join: {
          from: 'tasks.statusId',
          to: 'statuses.id',
        },
      },

      creator: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User',
        join: {
          from: 'tasks.creatorId',
          to: 'users.id',
        },
      },

      executor: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User',
        join: {
          from: 'tasks.executorId',
          to: 'users.id',
        },
      },
      labels: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: 'Label',
        join: {
          from: 'tasks.id',
          through: {
            from: 'tasks_labels.taskId',
            to: 'tasks_labels.labelId',
          },
          to: 'labels.id',
        },
      },
    };
  }
}
