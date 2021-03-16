import { InputService as SharedInputService } from '@src-shared/control-structure/services/information-flow/InputService';
import { ArrowRepo, InputRepo, ProjectEntityLastIdRepo, ProjectRepo } from '@stpa/src/main/repositories';
import { inject, injectable } from 'inversify';

@injectable()
export class InputService extends SharedInputService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(InputRepo) inputRepo: InputRepo,
    @inject(ProjectEntityLastIdRepo) lastIdRepo: ProjectEntityLastIdRepo,
    @inject(ArrowRepo) arrowRepo: ArrowRepo
  ) {
    super(projectRepo, inputRepo, lastIdRepo, arrowRepo);
  }
}
