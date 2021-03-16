import { Actuator } from '@src-shared/control-structure/models';
import { inject, injectable } from 'inversify';
import { Conversion, ConversionLastId } from '../../../models';
import { ActuatorRepo, ConversionLastIdRepo, ConversionRepo, ProjectRepo } from '../../../repositories';
import { EntityDependentService } from '../../common/EntityDependentService';

@injectable()
export class ConversionActuatorService extends EntityDependentService<Conversion, Actuator, ConversionLastId> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ConversionLastIdRepo) lastIdRepo: ConversionLastIdRepo,
    @inject(ConversionRepo) private readonly conversionRepo: ConversionRepo,
    @inject(ActuatorRepo) private readonly actuatorRepo: ActuatorRepo
  ) {
    super(Conversion, projectRepo, actuatorRepo, conversionRepo, lastIdRepo);
  }
}
