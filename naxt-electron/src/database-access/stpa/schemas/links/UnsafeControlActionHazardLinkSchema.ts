import { UnsafeControlActionHazardLink } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const unsafeControlActionHazardLinkSchema: RxJsonSchema<UnsafeControlActionHazardLink> = {
  title: 'stpa: unsafe control action-hazard schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    controlActionId: { type: 'number' },
    unsafeControlActionId: { type: 'number' },
    hazardId: { type: 'number' },
  },
  indexes: [
    'projectId',
    ['projectId', 'controlActionId', 'unsafeControlActionId', 'hazardId'],
    ['projectId', 'controlActionId', 'unsafeControlActionId'],
    ['projectId', 'hazardId'],
  ],
  required: ['projectId', 'controlActionId', 'unsafeControlActionId', 'hazardId'],
};
