import { InternalAndExternalEconomics } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const internalAndExternalEconomicsSchema: RxJsonSchema<InternalAndExternalEconomics> = {
  title: 'cast: internal and external economics schema',
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
