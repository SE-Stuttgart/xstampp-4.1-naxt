import { ResponsibilitySystemConstraintLink } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const responsibilitySystemConstraintLinkSchema: RxJsonSchema<ResponsibilitySystemConstraintLink> = {
  title: 'stpa: loss schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    responsibilityId: { type: 'number' },
    systemConstraintId: { type: 'number' },
  },
  indexes: [
    'projectId',
    ['projectId', 'responsibilityId', 'systemConstraintId'],
    ['projectId', 'responsibilityId'],
    ['projectId', 'systemConstraintId'],
  ],
  required: ['projectId', 'responsibilityId', 'systemConstraintId'],
};
