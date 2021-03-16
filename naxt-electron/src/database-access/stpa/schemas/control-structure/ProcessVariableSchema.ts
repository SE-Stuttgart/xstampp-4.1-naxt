import { ProcessVariable } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const processVariableSchema: RxJsonSchema<ProcessVariable> = {
  title: 'stpa: process variable schema',
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
    arrowId: { type: 'string' },
    nuSMVName: { type: 'string' },
    spinName: { type: 'string' },
    // eslint-disable-next-line @typescript-eslint/camelcase
    variable_type: { type: 'string' },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'name', 'description', 'state', 'arrowId', 'variable_type'],
};
