import { ControllerResponsibilityLink } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const controllerResponsibilitySchemaLink: RxJsonSchema<ControllerResponsibilityLink> = {
  title: 'cast: controller responsibility schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    controllerId: { type: 'number' },
    responsibilityId: { type: 'string' },
  },
  indexes: [
    'projectId',
    ['projectId', 'controllerId', 'responsibilityId'],
    ['projectId', 'controllerId'],
    ['projectId', 'responsibilityId'],
  ],
  required: ['projectId', 'controllerId', 'responsibilityId'],
};
