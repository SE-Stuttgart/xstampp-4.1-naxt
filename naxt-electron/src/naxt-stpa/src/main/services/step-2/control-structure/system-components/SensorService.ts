import { Sensor } from '@src-shared/control-structure/models';
import { SensorService as SharedSensorService } from '@src-shared/control-structure/services/system-components/SensorService';
import { BoxRepo, ProjectEntityLastIdRepo, ProjectRepo, SensorRepo } from '@stpa/src/main/repositories';
import { ConversionSensorService } from '@stpa/src/main/services/step-4/conversion-services/ConversionSensorService';
import { inject, injectable } from 'inversify';

function isChildOf(sensor: Sensor) {
  return conversion => conversion.parentId === sensor.id;
}

@injectable()
export class SensorService extends SharedSensorService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(SensorRepo) sensorRepo: SensorRepo,
    @inject(ProjectEntityLastIdRepo) lastIdRepo: ProjectEntityLastIdRepo,
    @inject(BoxRepo) boxRepo: BoxRepo,
    @inject(ConversionSensorService)
    private readonly conversionService: ConversionSensorService
  ) {
    super(projectRepo, sensorRepo, lastIdRepo, boxRepo);
  }

  async remove(sensor: Sensor): Promise<boolean> {
    const isRemoved = super.remove(sensor);

    if (isRemoved)
      await this.conversionService
        .getAll(sensor.projectId)
        .then(conversions => conversions.filter(isChildOf(sensor)))
        .then(conversions => conversions.forEach(this.conversionService.remove));

    return isRemoved;
  }
}
