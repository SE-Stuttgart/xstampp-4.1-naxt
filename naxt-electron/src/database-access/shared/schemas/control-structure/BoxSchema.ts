import { Box } from '@src-shared/control-structure/models';
import { RxJsonSchema } from 'rxdb';

export const boxSchema: RxJsonSchema<Box> = {
  title: 'shared: box schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    id: { type: 'string' },
    parent: { type: ['number', 'null'] },
    name: { type: 'string' },
    boxType: { type: 'string' },
    x: { type: 'number' },
    y: { type: 'number' },
    width: { type: 'number' },
    height: { type: 'number' },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id'],
};
