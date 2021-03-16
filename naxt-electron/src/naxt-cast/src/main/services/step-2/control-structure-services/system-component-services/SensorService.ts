import { RoleInTheAccident } from '@cast/src/main/models';
import { BoxRepo, LastIdRepo, ProjectRepo, RoleInTheAccidentRepo, SensorRepo } from '@cast/src/main/repositories';
import { ChipPrefix } from '@cast/src/main/services/models/Chip';
import { Controller, Output, Sensor } from '@src-shared/control-structure/models';
import { SensorService as SharedSensorService } from '@src-shared/control-structure/services/system-components/SensorService';
import { InformationFlowType, SystemComponentType } from '@src-shared/Enums';
import { inject, injectable } from 'inversify';
import { v4 as uuidV4 } from 'uuid';

@injectable()
export class SensorService extends SharedSensorService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(SensorRepo) controlActionRepo: SensorRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(RoleInTheAccidentRepo) private readonly roleInTheAccidentRepo: RoleInTheAccidentRepo,
    @inject(BoxRepo) boxRepo: BoxRepo
  ) {
    super(projectRepo, controlActionRepo, lastIdRepo, boxRepo);
  }

  async create(sensor: Sensor): Promise<Sensor> {
    const _sensor = await super.create(sensor);
    await this.roleInTheAccidentRepo.insert({
      ...new RoleInTheAccident(),
      id: uuidV4(),
      projectId: _sensor.projectId,
      componentId: _sensor.id,
      componentType: SystemComponentType.Sensor,
      label: `${ChipPrefix.Sensor}${_sensor.id}`,
      name: `role in the accident for ${ChipPrefix.Sensor}${_sensor.id}`,
    });
    return _sensor;
  }

  public async remove(sensor: Sensor): Promise<boolean> {
    const { projectId, id } = sensor;
    await this.roleInTheAccidentRepo.removeByComponentId(projectId, id, SystemComponentType.Sensor);
    return super.remove(sensor);
  }
}
