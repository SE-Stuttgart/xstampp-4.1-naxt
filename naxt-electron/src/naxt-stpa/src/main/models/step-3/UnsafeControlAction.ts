import { State } from '@src-shared/Enums';
import { Described, EntityDependent, Named, Stated } from '@src-shared/Interfaces';

export enum UCACategory {
  NotProvided = 'not provided',
  Provided = 'provided',
  TETL = 'too early or too late',
  STSOATL = 'stopped too soon or applied too long',
}

export class UnsafeControlAction implements EntityDependent, Named, Described, Stated {
  readonly id: number = -1;
  readonly parentId: number = -1;
  readonly projectId: string = '';

  readonly category: UCACategory = UCACategory.NotProvided;

  readonly name: string = '';
  readonly description: string = '';
  readonly state: State = State.TODO;

  readonly formal: string = '';
  readonly formalDescription: string = '';
}
