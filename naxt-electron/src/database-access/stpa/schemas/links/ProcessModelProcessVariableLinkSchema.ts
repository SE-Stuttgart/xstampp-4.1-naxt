import { ProcessModelProcessVariableLink } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const processModelProcessVariableLinkSchema: RxJsonSchema<ProcessModelProcessVariableLink> = {
  title: 'stpa: process model-process variable schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    processModelId: { type: 'number' },
    processVariableId: { type: 'number' },
    processVariableValue: { type: 'string' },
  },
  indexes: [
    'projectId',
    ['projectId', 'processModelId', 'processVariableId'],
    ['projectId', 'processModelId'],
    ['projectId', 'processVariableId'],
  ],
  required: ['projectId', 'processModelId', 'processVariableId', 'processVariableValue'],
};
