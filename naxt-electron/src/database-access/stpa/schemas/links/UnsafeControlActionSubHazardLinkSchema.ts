import { UnsafeControlActionSubHazardLink } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const unsafeControlActionSubHazardLinkSchema: RxJsonSchema<UnsafeControlActionSubHazardLink> = {
  title: 'stpa: unsafe control action-sub hazard schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    controlActionId: { type: 'number' },
    unsafeControlActionId: { type: 'number' },
    hazardId: { type: 'number' },
    subHazardId: { type: 'number' },
  },
  indexes: [
    'projectId',
    ['projectId', 'controlActionId', 'unsafeControlActionId', 'hazardId', 'subHazardId'],
    ['projectId', 'controlActionId', 'unsafeControlActionId'],
    ['projectId', 'hazardId', 'subHazardId'],
  ],
  required: ['projectId', 'controlActionId', 'unsafeControlActionId', 'hazardId', 'subHazardId'],
};
