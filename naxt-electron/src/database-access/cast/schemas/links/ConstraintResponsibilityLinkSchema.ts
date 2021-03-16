import { ConstraintResponsibilityLink } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const constraintResponsibilityLinkSchema: RxJsonSchema<ConstraintResponsibilityLink> = {
  title: 'cast: constraint responsibility link schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    constraintId: { type: 'string' },
    responsibilityId: { type: 'string' },
  },
  indexes: [
    'projectId',
    ['projectId', 'constraintId', 'responsibilityId'],
    ['projectId', 'constraintId'],
    ['projectId', 'responsibilityId'],
  ],
  required: ['projectId', 'constraintId', 'responsibilityId'],
};
