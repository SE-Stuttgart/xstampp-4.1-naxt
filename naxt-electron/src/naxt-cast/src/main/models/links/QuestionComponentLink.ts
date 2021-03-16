import { ProjectId } from '@src-shared/Interfaces';

export class QuestionComponentLink implements ProjectId {
  readonly projectId: string = '';

  readonly componentId: string = '';
  readonly questionId: string = '';

  readonly componentType: string = '';
}
