import { SubSystemConstraint } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const subSystemConstraintSchema: RxJsonSchema<SubSystemConstraint> = {
  title: 'stpa: sub system constraint schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    id: { type: 'number' },
    parentId: { type: 'number' },
    hazardId: { type: 'number' },
    subHazardId: { type: 'number' },
    name: { type: 'string' },
    description: { type: 'string' },
    state: { type: ['string', 'null'] },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'name', 'description', 'state'],
};
