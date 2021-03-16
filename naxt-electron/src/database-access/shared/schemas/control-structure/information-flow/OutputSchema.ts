import { Output } from '@src-shared/control-structure/models';
import { RxJsonSchema } from 'rxdb';

export const outputSchema: RxJsonSchema<Output> = {
  title: 'shared: output schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    id: { type: 'number' },
    name: { type: 'string' },
    description: { type: ['string', 'null'] },
    state: { type: 'string' },
    arrowId: { type: ['string', 'null'] },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'name', 'description', 'state', 'arrowId'],
};
