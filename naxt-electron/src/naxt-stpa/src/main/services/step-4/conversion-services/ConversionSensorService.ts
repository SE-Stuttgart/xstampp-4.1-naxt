import { Sensor } from '@src-shared/control-structure/models';
import { inject, injectable } from 'inversify';
import { ConversionSensor, ConversionSensorLastId } from '../../../models';
import { ConversionSensorLastIdRepo, ConversionSensorRepo, ProjectRepo, SensorRepo } from '../../../repositories';
import { EntityDependentService } from '../../common/EntityDependentService';

@injectable()
export class ConversionSensorService extends EntityDependentService<ConversionSensor, Sensor, ConversionSensorLastId> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ConversionSensorLastIdRepo) lastIdRepo: ConversionSensorLastIdRepo,
    @inject(ConversionSensorRepo) private readonly conversionRepo: ConversionSensorRepo,
    @inject(SensorRepo) private readonly sensorRepo: SensorRepo
  ) {
    super(ConversionSensor, projectRepo, sensorRepo, conversionRepo, lastIdRepo);
  }
}
