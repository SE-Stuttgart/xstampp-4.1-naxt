import { CommunicationAndCoordinationDescription } from '@cast/src/main/models/step-4/descriptions/CommunicationAndCoordinationDescription';
import { RxJsonSchema } from 'rxdb';

export const communicationAndCoordinationDescriptionSchema: RxJsonSchema<CommunicationAndCoordinationDescription> = {
  title: 'cast: communication and coordination description schema',
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
