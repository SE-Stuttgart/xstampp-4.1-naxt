import { ChangesAndDynamicsOverTimeDescription } from '@cast/src/main/models/step-4/descriptions/ChangesAndDynamicsOverTimeDescription';
import { RxJsonSchema } from 'rxdb';

export const changesAndDynamicsOverTimeDescriptionSchema: RxJsonSchema<ChangesAndDynamicsOverTimeDescription> = {
  title: 'cast: changes and dynamics over time description schema',
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
