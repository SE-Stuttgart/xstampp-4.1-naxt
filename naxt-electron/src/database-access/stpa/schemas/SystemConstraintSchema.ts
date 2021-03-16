import { SystemConstraint } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const systemConstraintSchema: RxJsonSchema<SystemConstraint> = {
  title: 'stpa: system constraint schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    id: { type: 'number' },
    name: { type: 'string' },
    description: { type: 'string' },
    state: { type: ['string', 'null'] },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'name', 'description', 'state'],
};
