import { UnsafeControlActionLastId } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const unsafeControlActionLastIdSchema: RxJsonSchema<UnsafeControlActionLastId> = {
  title: 'stpa: unsafe control action last id schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    controlActionId: { type: 'number' },
    lastId: { type: 'number' },
  },
  indexes: ['projectId', ['projectId', 'controlActionId']],
  required: ['projectId', 'controlActionId', 'lastId'],
};
