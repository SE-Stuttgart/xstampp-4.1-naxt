import { HazardLossLink } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const hazardLossLinkSchema: RxJsonSchema<HazardLossLink> = {
  title: 'stpa: hazard-loss link schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    lossId: { type: 'number' },
    hazardId: { type: 'number' },
  },
  indexes: ['projectId', ['projectId', 'lossId', 'hazardId'], ['projectId', 'lossId'], ['projectId', 'hazardId']],
  required: ['projectId', 'lossId', 'hazardId'],
};
