import { ControlAction } from '@src-shared/control-structure/models';
import { ControlActionService as SharedControlActionService } from '@src-shared/control-structure/services/information-flow/ControlActionService';
import { ArrowRepo, ControlActionRepo, ProjectEntityLastIdRepo, ProjectRepo } from '@stpa/src/main/repositories';
import { UnsafeControlActionService } from '@stpa/src/main/services/step-3/UnsafeControlActionService';
import { inject, injectable } from 'inversify';

@injectable()
export class ControlActionService extends SharedControlActionService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ControlActionRepo) controlActionRepo: ControlActionRepo,
    @inject(ProjectEntityLastIdRepo) lastIdRepo: ProjectEntityLastIdRepo,
    @inject(ArrowRepo) arrowRepo: ArrowRepo,
    @inject(UnsafeControlActionService)
    private readonly unsafeControlActionService: UnsafeControlActionService
  ) {
    super(projectRepo, controlActionRepo, lastIdRepo, arrowRepo);
  }

  async remove(controlAction: ControlAction): Promise<boolean> {
    const isRemoved = super.remove(controlAction);

    if (isRemoved)
      await this.unsafeControlActionService
        .getAll(controlAction.projectId)
        .then(unsafeControlActions => unsafeControlActions.filter(isChildOf(controlAction)))
        .then(unsafeControlActions => unsafeControlActions.forEach(this.unsafeControlActionService.remove));

    return isRemoved;
  }
}

function isChildOf(controlAction: ControlAction) {
  return uca => uca.parentId === controlAction.id;
}
