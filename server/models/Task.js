import { Model } from 'objection';
import User from './User.js';
import Status from './Status.js';
import Label from './Label.js';

export default class Task extends Model {
  static get tableName() {
    return 'tasks';
  }

  static get modifiers() {
    return {
      filterIsCreatorUser: (query, creatorId) => {
        if (creatorId) query.andWhere({ creatorId });
      },
      filterStatus: (query, statusId) => {
        if (statusId) query.andWhere({ statusId });
      },
      filterExecutor: (query, executorId) => {
        if (executorId) query.andWhere({ executorId });
      },
      filterLabel: (query, labelId) => {
        if (labelId) {
          query.whereExists(
            Task.relatedQuery('labels').where('label_id', labelId),
          );
        }
      },
    };
  }

  static get relationMappings() {
    return {
      status: {
        relation: Model.BelongsToOneRelation,
        modelClass: Status,
        join: {
          from: 'tasks.statusId',
          to: 'statuses.id',
        },
      },
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.creatorId',
          to: 'users.id',
        },
      },
      executor: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.executorId',
          to: 'users.id',
        },
      },
      labels: {
        relation: Model.ManyToManyRelation,
        modelClass: Label,
        join: {
          from: 'tasks.id',
          through: {
            from: 'tasks_labels.task_id',
            to: 'tasks_labels.label_id',
          },
          to: 'labels.id',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'status_id', 'creator_id'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        description: { type: 'string' },
        status_id: { type: 'number' },
        creator_id: { type: 'number' },
        executor_id: { type: 'number' },
        labels: { type: ['number', 'array'], items: { type: 'object', properties: 'id' } },
      },
    };
  }
}
