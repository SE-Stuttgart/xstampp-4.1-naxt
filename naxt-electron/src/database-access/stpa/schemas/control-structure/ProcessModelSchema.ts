import { ProcessModel } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const processModelSchema: RxJsonSchema<ProcessModel> = {
  title: 'stpa: process model schema',
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
    controllerId: { type: 'number' },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'name', 'description', 'state'],
};
