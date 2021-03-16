import { SafetyManagementSystemDescription } from '@cast/src/main/models/step-4/descriptions/SafetyManagementSystemDescription';
import { RxJsonSchema } from 'rxdb';

export const safetyManagementSystemDescriptionSchema: RxJsonSchema<SafetyManagementSystemDescription> = {
  title: 'cast: safety management system description schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    description: { type: 'string' },
    linkedDocuments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          fileName: { type: 'string' },
          path: { type: 'string' },
          type: { type: 'string' },
        },
      },
    },
  },
  indexes: ['projectId'],
  required: ['projectId', 'description', 'linkedDocuments'],
};
