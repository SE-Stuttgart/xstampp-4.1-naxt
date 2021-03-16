import { SubHazardLastId } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const subHazardLastIdSchema: RxJsonSchema<SubHazardLastId> = {
  title: 'stpa: sub hazard last id schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    hazardId: { type: 'number' },
    lastId: { type: 'number' },
  },
  indexes: ['projectId', ['projectId', 'hazardId']],
  required: ['projectId', 'hazardId', 'lastId'],
};
