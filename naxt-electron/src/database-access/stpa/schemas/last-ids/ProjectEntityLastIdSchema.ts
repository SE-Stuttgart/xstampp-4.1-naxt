import { ProjectEntityLastId } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const projectEntityLastIdSchema: RxJsonSchema<ProjectEntityLastId> = {
  title: 'stpa: project entity last id schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    entity: { type: 'string' },
    lastId: { type: 'number' },
  },
  indexes: ['projectId', ['projectId', 'entity']],
  required: ['projectId', 'entity', 'lastId'],
};
