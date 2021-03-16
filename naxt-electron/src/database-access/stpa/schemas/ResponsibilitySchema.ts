import { Responsibility } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const responsibilitySchema: RxJsonSchema<Responsibility> = {
  title: 'stpa: responsibility schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    id: { type: 'number' },
    name: { type: 'string' },
    description: { type: 'string' },
    state: { type: ['string', 'null'] },
    controllerId: { type: 'number' },
    controllerProjectId: { type: 'string' },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'name', 'description', 'state', 'controllerId', 'controllerProjectId'],
};
