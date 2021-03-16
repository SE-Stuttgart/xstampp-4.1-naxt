import { SubSystemConstraintLastId } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const subSystemConstraintLastIdSchema: RxJsonSchema<SubSystemConstraintLastId> = {
  title: 'stpa: sub system constraint schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    systemConstraintId: { type: 'number' },
    lastId: { type: 'number' },
  },
  indexes: ['projectId', ['projectId', 'systemConstraintId']],
  required: ['projectId', 'systemConstraintId', 'lastId'],
};
