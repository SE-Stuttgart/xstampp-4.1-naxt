import { SafetyCultureControllerLink } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const safetyCultureControllerLinkSchema: RxJsonSchema<SafetyCultureControllerLink> = {
  title: 'cast: safety culture controller link schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    controllerId: { type: 'number' },
    safetyCultureId: { type: 'string' },
  },
  indexes: [
    'projectId',
    ['projectId', 'controllerId', 'safetyCultureId'],
    ['projectId', 'controllerId'],
    ['projectId', 'safetyCultureId'],
  ],
  required: ['projectId', 'controllerId', 'safetyCultureId'],
};
