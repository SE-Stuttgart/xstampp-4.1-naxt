import { QuestionComponentLink } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const questionComponentLinkSchema: RxJsonSchema<QuestionComponentLink> = {
  title: 'cast: question component link schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    questionId: { type: 'string' },
    componentId: { type: 'string' },
    componentType: { type: 'string' },
  },
  indexes: [
    'projectId',
    ['projectId', 'questionId'],
    ['projectId', 'componentId'],
    ['projectId', 'componentType'],
    ['projectId', 'questionId', 'componentId'],
    ['projectId', 'componentType', 'questionId'],
    ['projectId', 'componentType', 'componentId'],
  ],
  required: ['projectId', 'questionId', 'componentId', 'componentType'],
};
