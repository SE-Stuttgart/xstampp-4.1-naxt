import { VectorGraphic } from '@src-shared/control-structure/models';
import { RxJsonSchema } from 'rxdb';

export const vectorGraphicSchema: RxJsonSchema<VectorGraphic> = {
  title: 'shared: vector graphic schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    graphic: { type: ['string', 'null'] },
    blackWhiteGraphic: { type: ['string', 'null'] },
  },
  indexes: ['projectId'],
  required: ['projectId'],
};
