import { OutputService as SharedOutputService } from '@src-shared/control-structure/services/information-flow/OutputService';
import { ArrowRepo, OutputRepo, ProjectEntityLastIdRepo, ProjectRepo } from '@stpa/src/main/repositories';
import { inject, injectable } from 'inversify';

@injectable()
export class OutputService extends SharedOutputService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(OutputRepo) outputRepo: OutputRepo,
    @inject(ProjectEntityLastIdRepo) lastIdRepo: ProjectEntityLastIdRepo,
    @inject(ArrowRepo) arrowRepo: ArrowRepo
  ) {
    super(projectRepo, outputRepo, lastIdRepo, arrowRepo);
  }
}
