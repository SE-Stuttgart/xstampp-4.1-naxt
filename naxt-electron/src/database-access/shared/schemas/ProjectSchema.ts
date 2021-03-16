import { Project } from '@src-shared/project/Project';
import { RxJsonSchema } from 'rxdb';

export const projectSchema: RxJsonSchema<Project> = {
  title: 'shared: project schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    filePath: { type: 'string' },
    fileName: { type: 'string' },
    projectType: { type: 'string' },
    unsavedChanges: { type: 'boolean' },
    name: { type: 'string' },
    description: { type: 'string' },
    state: { type: 'string' },
  },
  indexes: ['projectId'],
  required: ['projectId', 'unsavedChanges', 'name', 'description', 'state'],
};
