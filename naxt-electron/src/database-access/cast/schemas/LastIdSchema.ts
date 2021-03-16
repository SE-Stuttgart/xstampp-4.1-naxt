import { LastIdEntry } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const lastIdEntrySchema: RxJsonSchema<LastIdEntry> = {
  title: 'cast: last id entry schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    entry: { type: 'string' },
    dependentsOn: { type: 'string' },
    lastId: { type: 'number' },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'entry', 'dependentsOn', 'lastId'],
};
