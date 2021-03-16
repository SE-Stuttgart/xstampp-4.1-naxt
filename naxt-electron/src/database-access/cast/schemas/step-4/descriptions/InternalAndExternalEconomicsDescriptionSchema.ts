import { InternalAndExternalEconomicsDescription } from '@cast/src/main/models/step-4/descriptions/InternalAndExternalEconomicsDescription';
import { RxJsonSchema } from 'rxdb';

export const internalAndExternalEconomicsDescriptionSchema: RxJsonSchema<InternalAndExternalEconomicsDescription> = {
  title: 'cast: internal and external economics schema',
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
