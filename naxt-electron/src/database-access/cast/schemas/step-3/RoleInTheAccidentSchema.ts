import { RoleInTheAccident } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const roleInTheAccidentSchema: RxJsonSchema<RoleInTheAccident> = {
  title: 'cast: role in the accident schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    id: { type: 'string' },
    label: { type: 'string' },
    componentId: { type: 'number' },
    componentType: { type: 'string' },
    explanation: { type: 'string' },
    description: { type: 'string' },
    rule: { type: 'string' },
    state: { type: 'string' },
    name: { type: 'string' },
    flawProcessVariable: { type: 'string' },
    currentValue: { type: 'string' },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: [
    'projectId',
    'id',
    'label',
    'componentId',
    'componentType',
    'explanation',
    'description',
    'name',
    'rule',
    'state',
    'currentValue',
    'flawProcessVariable',
  ],
};
