import { LinkedDocuments, SystemDescription } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const systemDescriptionSchema: RxJsonSchema<SystemDescription> = {
  title: 'stpa: system description schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    description: { type: 'string' },
  },
  indexes: ['projectId'],
  required: ['projectId', 'description'],
};

export const linkedDocumentsSchema: RxJsonSchema<LinkedDocuments> = {
  title: 'stpa: linked documents schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    linkedDocuments: {
      type: ['array', 'null'],
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
  required: ['projectId'],
};
