import { SafetyManagementSystem } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const safetyManagementSystemSchema: RxJsonSchema<SafetyManagementSystem> = {
  title: 'cast: safety management system schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    id: { type: 'string' },
    label: { type: 'string' },
    description: { type: 'string' },
    name: { type: 'string' },
    descriptionTextField: { type: 'string' },
    state: { type: 'string' },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'label', 'description', 'name', 'state', 'descriptionTextField'],
};
