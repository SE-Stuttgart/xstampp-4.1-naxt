import { RxJsonSchema } from 'rxdb';
import { ResponsibilitySubSystemConstraintLink } from '@stpa/src/main/models';

export const responsibilitySubSystemConstraintLinkSchema: RxJsonSchema<ResponsibilitySubSystemConstraintLink> = {
  title: 'stpa: responsibility-sub system constraint schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    responsibilityId: { type: 'number' },
    systemConstraintId: { type: 'number' },
    subSystemConstraintId: { type: 'number' },
  },
  indexes: [
    'projectId',
    ['projectId', 'responsibilityId', 'systemConstraintId', 'subSystemConstraintId'],
    ['projectId', 'responsibilityId'],
    ['projectId', 'systemConstraintId', 'subSystemConstraintId'],
  ],
  required: ['projectId', 'responsibilityId', 'systemConstraintId', 'subSystemConstraintId'],
};
