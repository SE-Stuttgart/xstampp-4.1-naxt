import { CommunicationAndCoordinationController1Link } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const communicationAndCoordinationController1LinkSchema: RxJsonSchema<CommunicationAndCoordinationController1Link> = {
  title: 'cast: communication and coordination controller link schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    communicationAndCoordinationId: { type: 'string' },
    controllerId: { type: 'number' },
  },
  indexes: [
    'projectId',
    ['projectId', 'communicationAndCoordinationId', 'controllerId'],
    ['projectId', 'communicationAndCoordinationId'],
    ['projectId', 'controllerId'],
  ],
  required: ['projectId', 'communicationAndCoordinationId', 'controllerId'],
};

export const communicationAndCoordinationController2LinkSchema: RxJsonSchema<CommunicationAndCoordinationController1Link> = {
  title: 'cast: communication and coordination controller link schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    communicationAndCoordinationId: { type: 'string' },
    controllerId: { type: 'number' },
  },
  indexes: [
    'projectId',
    ['projectId', 'communicationAndCoordinationId', 'controllerId'],
    ['projectId', 'communicationAndCoordinationId'],
    ['projectId', 'controllerId'],
  ],
  required: ['projectId', 'communicationAndCoordinationId', 'controllerId'],
};
