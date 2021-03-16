import { SubRecommendation } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const subRecommendationSchema: RxJsonSchema<SubRecommendation> = {
  title: 'cast: sub recommendation schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    id: { type: 'string' },
    label: { type: 'string' },
    parentId: { type: 'string' },
    description: { type: 'string' },
    duration: { type: 'string' },
    name: { type: 'string' },
    personInCharge: { type: 'string' },
    state: { type: 'string' },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'parentId', 'id', 'label', 'description', 'name', 'duration', 'personInCharge', 'state'],
};
