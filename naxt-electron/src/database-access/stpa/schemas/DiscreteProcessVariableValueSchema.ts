import { DiscreteProcessVariableValue } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const discreteProcessVariableValueSchema: RxJsonSchema<DiscreteProcessVariableValue> = {
  title: 'stpa: discrete process variable value schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    processVariableId: { type: 'number' },
    variableValue: { type: 'string' },
  },
  indexes: ['projectId', ['projectId', 'processVariableId']],
  required: ['projectId', 'processVariableId'],
};
