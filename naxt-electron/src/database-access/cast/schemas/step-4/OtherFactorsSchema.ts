import { OtherFactors } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const otherFactorsSchema: RxJsonSchema<OtherFactors> = {
  title: 'cast: other factors schema',
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
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'description', 'linkedDocuments'],
};
