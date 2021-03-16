import { SubHazard } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const subHazardSchema: RxJsonSchema<SubHazard> = {
  title: 'stpa: sub hazard schema',
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
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'name', 'description', 'state'],
};
