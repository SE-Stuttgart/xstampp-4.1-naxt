import { Rule } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const ruleSchema: RxJsonSchema<Rule> = {
  title: 'stpa: rule schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    id: { type: 'number' },
    parentId: { type: 'number' },
    name: { type: 'string' },
    description: { type: 'string' },
    state: { type: ['string', 'null'] },
    rule: { type: 'string' },
    controlActionId: { type: 'number' },
    controllerId: { type: 'number' },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'parentId', 'state', 'rule', 'controllerId', 'controllerId'],
};
