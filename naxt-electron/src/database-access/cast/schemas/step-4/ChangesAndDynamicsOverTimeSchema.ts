import { ChangesAndDynamicsOverTime } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const changesAndDynamicsOverTimeSchema: RxJsonSchema<ChangesAndDynamicsOverTime> = {
  title: 'cast: changes and dynamics over time schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    id: { type: 'string' },
    label: { type: 'string' },
    description: { type: 'string' },
    descriptionTextField: { type: 'string' },
    name: { type: 'string' },
    state: { type: 'string' },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'label', 'description', 'name', 'state', 'descriptionTextField'],
};
