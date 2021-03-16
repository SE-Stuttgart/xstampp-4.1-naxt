import { ChangesAndDynamicsOverTimeControllerLink } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const changesAndDynamicsOverTimeControllerLinkSchema: RxJsonSchema<ChangesAndDynamicsOverTimeControllerLink> = {
  title: 'cast: changes and dynamics over time controller link schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    changesAndDynamicsOverTimeId: { type: 'string' },
    controllerId: { type: 'number' },
  },
  indexes: [
    'projectId',
    ['projectId', 'changesAndDynamicsOverTimeId', 'controllerId'],
    ['projectId', 'controllerId'],
    ['projectId', 'changesAndDynamicsOverTimeId'],
  ],
  required: ['projectId', 'controllerId', 'changesAndDynamicsOverTimeId'],
};
