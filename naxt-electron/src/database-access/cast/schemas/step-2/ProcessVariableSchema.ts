import { ProcessVariable } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const processVariableSchema: RxJsonSchema<ProcessVariable> = {
  title: 'cast: process variable schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    id: { type: 'string' },
    label: { type: 'string' },
    controllerId: { type: 'number' },
    name: { type: 'string' },
    currentValue: { type: 'string' },
    flaws: { type: 'string' },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'label', 'controllerId', 'name'],
};
