import { HazardSystemConstraintLink } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const hazardSystemConstraintLinkSchema: RxJsonSchema<HazardSystemConstraintLink> = {
  title: 'stpa: hazard-system constraint link schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    systemConstraintId: { type: 'number' },
    hazardId: { type: 'number' },
  },
  indexes: [
    'projectId',
    ['projectId', 'systemConstraintId', 'hazardId'],
    ['projectId', 'systemConstraintId'],
    ['projectId', 'hazardId'],
  ],
  required: ['projectId', 'systemConstraintId', 'hazardId'],
};
