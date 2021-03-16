import { ProcessVariableResponsibilityLink } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const processVariableResponsibilityLinkSchema: RxJsonSchema<ProcessVariableResponsibilityLink> = {
  title: 'stpa: process variable-responsibility schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    processVariableId: { type: 'number' },
    responsibilityId: { type: 'number' },
  },
  indexes: [
    'projectId',
    ['projectId', 'processVariableId', 'responsibilityId'],
    ['projectId', 'processVariableId'],
    ['projectId', 'responsibilityId'],
  ],
  required: ['projectId', 'processVariableId', 'responsibilityId'],
};
