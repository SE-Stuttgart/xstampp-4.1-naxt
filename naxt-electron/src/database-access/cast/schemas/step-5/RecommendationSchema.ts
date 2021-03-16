import { Recommendation } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const recommendationSchema: RxJsonSchema<Recommendation> = {
  title: 'cast: recommendation schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    id: { type: 'string' },
    label: { type: 'string' },
    description: { type: 'string' },
    duration: { type: 'string' },
    name: { type: 'string' },
    personInCharge: { type: 'string' },
    state: { type: 'string' },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'label', 'description', 'duration', 'name', 'personInCharge', 'state'],
};
