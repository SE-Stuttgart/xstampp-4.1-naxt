import { InternalAndExternalEconomicsControllerLink } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const internalAndExternalEconomicsControllerLinkSchema: RxJsonSchema<InternalAndExternalEconomicsControllerLink> = {
  title: 'cast: internal and external economics controller link schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    controllerId: { type: 'number' },
    internalAndExternalEconomicsId: { type: 'string' },
  },
  indexes: [
    'projectId',
    ['projectId', 'controllerId', 'internalAndExternalEconomicsId'],
    ['projectId', 'controllerId'],
    ['projectId', 'internalAndExternalEconomicsId'],
  ],
  required: ['projectId', 'controllerId', 'internalAndExternalEconomicsId'],
};
