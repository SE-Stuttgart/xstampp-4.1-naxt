import { QuestionAndAnswer } from '@cast/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const questionAndAnswersSchema: RxJsonSchema<QuestionAndAnswer> = {
  title: 'cast: question and answer schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    id: { type: 'string' },
    label: { type: 'string' },
    description: { type: 'string' },
    name: { type: 'string' },
    state: { type: 'string' },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'description', 'name', 'state'],
};
