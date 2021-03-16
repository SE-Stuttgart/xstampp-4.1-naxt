import { RoleInTheAccident } from '@cast/src/main/models';
import { ActuatorRepo, BoxRepo, LastIdRepo, ProjectRepo, RoleInTheAccidentRepo } from '@cast/src/main/repositories';
import { ChipPrefix } from '@cast/src/main/services/models/Chip';
import { Actuator, Output } from '@src-shared/control-structure/models';
import { ActuatorService as SharedActuatorService } from '@src-shared/control-structure/services/system-components/ActuatorService';
import { InformationFlowType, SystemComponentType } from '@src-shared/Enums';
import { inject, injectable } from 'inversify';
import { v4 as uuidV4 } from 'uuid';

@injectable()
export class ActuatorService extends SharedActuatorService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ActuatorRepo) controlActionRepo: ActuatorRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(RoleInTheAccidentRepo) private readonly roleInTheAccidentRepo: RoleInTheAccidentRepo,
    @inject(BoxRepo) boxRepo: BoxRepo
  ) {
    super(projectRepo, controlActionRepo, lastIdRepo, boxRepo);
  }

  async create(actuator: Actuator): Promise<Actuator> {
    const _actuator = await super.create(actuator);
    await this.roleInTheAccidentRepo.insert({
      ...new RoleInTheAccident(),
      id: uuidV4(),
      projectId: _actuator.projectId,
      componentId: _actuator.id,
      componentType: SystemComponentType.Actuator,
      label: `${ChipPrefix.Actuator}${_actuator.id}`,
      name: `role in the accident for ${ChipPrefix.Actuator}${_actuator.id}`,
    });
    return _actuator;
  }

  public async remove(actuator: Actuator): Promise<boolean> {
    const { projectId, id } = actuator;
    await this.roleInTheAccidentRepo.removeByComponentId(projectId, id, SystemComponentType.Actuator);
    return super.remove(actuator);
  }
}
