import { RoleInTheAccident } from '@cast/src/main/models';
import {
  ArrowRepo,
  ControlActionRepo,
  LastIdRepo,
  ProjectRepo,
  RoleInTheAccidentRepo,
} from '@cast/src/main/repositories';
import { ChipPrefix } from '@cast/src/main/services/models/Chip';
import { ControlAction } from '@src-shared/control-structure/models';
import { ControlActionService as SharedControlActionService } from '@src-shared/control-structure/services/information-flow/ControlActionService';
import { InformationFlowType } from '@src-shared/Enums';
import { inject, injectable } from 'inversify';
import { v4 as uuidV4 } from 'uuid';

@injectable()
export class ControlActionService extends SharedControlActionService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ControlActionRepo) controlActionRepo: ControlActionRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(RoleInTheAccidentRepo) private readonly roleInTheAccidentRepo: RoleInTheAccidentRepo,
    @inject(ArrowRepo) arrowRepo: ArrowRepo
  ) {
    super(projectRepo, controlActionRepo, lastIdRepo, arrowRepo);
  }

  async create(controlAction: ControlAction): Promise<ControlAction> {
    const _controlAction = await super.create(controlAction);
    await this.roleInTheAccidentRepo.insert({
      ...new RoleInTheAccident(),
      id: uuidV4(),
      projectId: _controlAction.projectId,
      componentId: _controlAction.id,
      componentType: InformationFlowType.ControlAction,
      label: `${ChipPrefix.ControlAction}${_controlAction.id}`,
      name: `role in the accident for ${ChipPrefix.ControlAction}${_controlAction.id}`,
    });
    return _controlAction;
  }

  public async remove(controlAction: ControlAction): Promise<boolean> {
    const { projectId, id } = controlAction;
    await this.roleInTheAccidentRepo.removeByComponentId(projectId, id, InformationFlowType.ControlAction);
    return super.remove(controlAction);
  }
}
