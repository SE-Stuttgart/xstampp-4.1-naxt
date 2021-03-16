import { ImplementationConstraint } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const implementationConstraintSchema: RxJsonSchema<ImplementationConstraint> = {
  title: 'stpa: implementation constraint schema',
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
    lossScenarioId: { type: 'number' },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'name', 'description', 'state'],
};
