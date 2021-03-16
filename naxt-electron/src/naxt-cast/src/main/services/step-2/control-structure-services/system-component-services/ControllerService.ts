import { RoleInTheAccident } from '@cast/src/main/models';
import { BoxRepo, ControllerRepo, LastIdRepo, ProjectRepo, RoleInTheAccidentRepo } from '@cast/src/main/repositories';
import { ChipPrefix } from '@cast/src/main/services/models/Chip';
import { ControlledProcess, Controller, Output } from '@src-shared/control-structure/models';
import { ControllerService as SharedControllerService } from '@src-shared/control-structure/services/system-components/ControllerService';
import { InformationFlowType, SystemComponentType } from '@src-shared/Enums';
import { inject, injectable } from 'inversify';
import { v4 as uuidV4 } from 'uuid';

@injectable()
export class ControllerService extends SharedControllerService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ControllerRepo) controllerRepo: ControllerRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(RoleInTheAccidentRepo) private readonly roleInTheAccidentRepo: RoleInTheAccidentRepo,
    @inject(BoxRepo) boxRepo: BoxRepo
  ) {
    super(projectRepo, controllerRepo, lastIdRepo, boxRepo);
  }

  async create(controller: Controller): Promise<Controller> {
    const _controller = await super.create(controller);
    await this.roleInTheAccidentRepo.insert({
      ...new RoleInTheAccident(),
      id: uuidV4(),
      projectId: _controller.projectId,
      componentId: _controller.id,
      componentType: SystemComponentType.Controller,
      label: `${ChipPrefix.Controller}${_controller.id}`,
      name: `role in the accident for ${ChipPrefix.Controller}${_controller.id}`,
    });
    return _controller;
  }

  public async remove(controller: Controller): Promise<boolean> {
    const { projectId, id } = controller;
    await this.roleInTheAccidentRepo.removeByComponentId(projectId, id, SystemComponentType.Controller);
    return super.remove(controller);
  }
}
