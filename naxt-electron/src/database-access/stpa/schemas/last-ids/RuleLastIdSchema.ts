import { RuleLastId } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const ruleLastIdSchema: RxJsonSchema<RuleLastId> = {
  title: 'stpa: rule last id schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    controllerId: { type: 'number' },
    lastId: { type: 'number' },
  },
  indexes: ['projectId', ['projectId', 'controllerId']],
  required: ['projectId', 'controllerId', 'lastId'],
};
