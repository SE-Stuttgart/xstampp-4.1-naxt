import { RoleInTheAccident } from '@cast/src/main/models';
import {
  BoxRepo,
  ControlledProcessRepo,
  LastIdRepo,
  ProjectRepo,
  RoleInTheAccidentRepo,
} from '@cast/src/main/repositories';
import { ChipPrefix } from '@cast/src/main/services/models/Chip';
import { Actuator, ControlledProcess, Output } from '@src-shared/control-structure/models';
import { ControlledProcessService as SharedControlledProcessService } from '@src-shared/control-structure/services/system-components/ControlledProcessService';
import { InformationFlowType, SystemComponentType } from '@src-shared/Enums';
import { inject, injectable } from 'inversify';
import { v4 as uuidV4 } from 'uuid';

@injectable()
export class ControlledProcessService extends SharedControlledProcessService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ControlledProcessRepo) controlActionRepo: ControlledProcessRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(RoleInTheAccidentRepo) private readonly roleInTheAccidentRepo: RoleInTheAccidentRepo,
    @inject(BoxRepo) boxRepo: BoxRepo
  ) {
    super(projectRepo, controlActionRepo, lastIdRepo, boxRepo);
  }

  async create(controlledProcess: ControlledProcess): Promise<ControlledProcess> {
    const _controlledProcess = await super.create(controlledProcess);
    await this.roleInTheAccidentRepo.insert({
      ...new RoleInTheAccident(),
      id: uuidV4(),
      projectId: _controlledProcess.projectId,
      componentId: _controlledProcess.id,
      componentType: SystemComponentType.ControlledProcess,
      label: `${ChipPrefix.ControlledProcess}${_controlledProcess.id}`,
      name: `role in the accident for ${ChipPrefix.ControlledProcess}${_controlledProcess.id}`,
    });
    return _controlledProcess;
  }

  public async remove(controlledProcess: ControlledProcess): Promise<boolean> {
    const { projectId, id } = controlledProcess;
    await this.roleInTheAccidentRepo.removeByComponentId(projectId, id, SystemComponentType.ControlledProcess);
    return super.remove(controlledProcess);
  }
}
