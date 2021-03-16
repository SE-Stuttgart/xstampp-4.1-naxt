import { Controller } from '@src-shared/control-structure/models';
import { ControllerService as SharedControllerService } from '@src-shared/control-structure/services/system-components/ControllerService';
import { BoxRepo, ControllerRepo, ProjectEntityLastIdRepo, ProjectRepo } from '@stpa/src/main/repositories';
import { ControlAlgorithmService } from '@stpa/src/main/services/step-4/ControlAlgorithmService';
import { inject, injectable } from 'inversify';

function isChildOf(controller: Controller) {
  return controlAlgorithm => controlAlgorithm.parentId === controller.id;
}

@injectable()
export class ControllerService extends SharedControllerService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ControllerRepo) controllerRepo: ControllerRepo,
    @inject(ProjectEntityLastIdRepo) lastIdRepo: ProjectEntityLastIdRepo,
    @inject(BoxRepo) boxRepo: BoxRepo,
    @inject(ControlAlgorithmService)
    private readonly controlAlgorithmService: ControlAlgorithmService
  ) {
    super(projectRepo, controllerRepo, lastIdRepo, boxRepo);
  }

  async remove(controller: Controller): Promise<boolean> {
    const isRemoved = super.remove(controller);

    if (isRemoved)
      await this.controlAlgorithmService
        .getAll(controller.projectId)
        .then(controlAlgorithms => controlAlgorithms.filter(isChildOf(controller)))
        .then(controlAlgorithms => controlAlgorithms.forEach(this.controlAlgorithmService.remove));

    return isRemoved;
  }
}
