import { ControlledProcessService as SharedControlledProcessService } from '@src-shared/control-structure/services/system-components/ControlledProcessService';
import { BoxRepo, ControlledProcessRepo, ProjectEntityLastIdRepo, ProjectRepo } from '@stpa/src/main/repositories';
import { inject, injectable } from 'inversify';

@injectable()
export class ControlledProcessService extends SharedControlledProcessService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ControlledProcessRepo) controlledProcessRepo: ControlledProcessRepo,
    @inject(ProjectEntityLastIdRepo) lastIdRepo: ProjectEntityLastIdRepo,
    @inject(BoxRepo) boxRepo: BoxRepo
  ) {
    super(projectRepo, controlledProcessRepo, lastIdRepo, boxRepo);
  }
}
