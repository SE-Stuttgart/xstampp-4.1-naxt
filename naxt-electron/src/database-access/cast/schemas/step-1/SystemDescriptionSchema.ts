import { RxJsonSchema } from 'rxdb';
import { SystemDescription } from '@cast/src/main/models';

export const systemDescriptionSchema: RxJsonSchema<SystemDescription> = {
  title: 'cast: system description schema',
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
