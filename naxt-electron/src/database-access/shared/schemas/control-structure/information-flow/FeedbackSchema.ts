import { Feedback } from '@src-shared/control-structure/models';
import { RxJsonSchema } from 'rxdb';

export const feedbackSchema: RxJsonSchema<Feedback> = {
  title: 'shared: feedback schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    id: { type: 'number' },
    name: { type: 'string' },
    description: { type: ['string', 'null'] },
    state: { type: ['string', 'null'] },
    arrowId: { type: ['string', 'null'] },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'name', 'description', 'state', 'arrowId'],
};
