import { SafetyManagementSystemControllerLink } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const safetyManagementSystemControllerLinkSchema: RxJsonSchema<SafetyManagementSystemControllerLink> = {
  title: 'cast: safety management system controller link schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    safetyManagementSystemId: { type: 'string' },
    controllerId: { type: 'number' },
  },
  indexes: [
    'projectId',
    ['projectId', 'controllerId', 'safetyManagementSystemId'],
    ['projectId', 'controllerId'],
    ['projectId', 'safetyManagementSystemId'],
  ],
  required: ['projectId', 'controllerId', 'safetyManagementSystemId'],
};
