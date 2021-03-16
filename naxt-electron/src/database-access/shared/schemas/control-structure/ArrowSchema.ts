import { Arrow } from '@src-shared/control-structure/models';
import { RxJsonSchema } from 'rxdb';

export const arrowSchema: RxJsonSchema<Arrow> = {
  title: 'shared: arrow schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    id: { type: 'string' },
    source: { type: 'string' },
    destination: { type: 'string' },
    type: { type: 'string' },
    parents: { type: 'string' },
    label: { type: 'string' },
    parts: { type: ['array', 'null'], items: { type: 'number' } },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id'],
};
