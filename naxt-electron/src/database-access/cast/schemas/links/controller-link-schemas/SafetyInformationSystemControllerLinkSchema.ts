import { SafetyInformationSystemControllerLink } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const safetyInformationSystemControllerLinkSchema: RxJsonSchema<SafetyInformationSystemControllerLink> = {
  title: 'cast: safety information system controller link schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    controllerId: { type: 'number' },
    safetyInformationSystemId: { type: 'string' },
  },
  indexes: [
    'projectId',
    ['projectId', 'controllerId', 'safetyInformationSystemId'],
    ['projectId', 'controllerId'],
    ['projectId', 'safetyInformationSystemId'],
  ],
  required: ['projectId', 'controllerId', 'safetyInformationSystemId'],
};
