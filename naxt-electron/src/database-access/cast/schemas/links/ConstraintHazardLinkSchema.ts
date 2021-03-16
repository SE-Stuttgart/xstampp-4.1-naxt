import { ConstraintHazardLink } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const constraintHazardLinkSchema: RxJsonSchema<ConstraintHazardLink> = {
  title: 'cast: constraint hazard link schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    constraintId: { type: 'string' },
    hazardId: { type: 'string' },
  },
  indexes: [
    'projectId',
    ['projectId', 'constraintId', 'hazardId'],
    ['projectId', 'constraintId'],
    ['projectId', 'hazardId'],
  ],
  required: ['projectId', 'constraintId', 'hazardId'],
};
