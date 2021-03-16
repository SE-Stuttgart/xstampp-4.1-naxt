import { UnsafeControlAction } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const unsafeControlActionSchema: RxJsonSchema<UnsafeControlAction> = {
  title: 'stpa: unsafe control action schema',
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
    category: { type: 'string' },
    formal: { type: 'string' },
    formalDescription: { type: 'string' },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'name', 'description', 'state'],
};
