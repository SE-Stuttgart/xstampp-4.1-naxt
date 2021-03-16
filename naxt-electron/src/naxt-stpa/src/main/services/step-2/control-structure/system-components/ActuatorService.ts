import { Actuator } from '@src-shared/control-structure/models';
import { ActuatorService as SharedActuatorService } from '@src-shared/control-structure/services/system-components/ActuatorService';
import { ActuatorRepo, BoxRepo, ProjectEntityLastIdRepo, ProjectRepo } from '@stpa/src/main/repositories';
import { ConversionActuatorService } from '@stpa/src/main/services/step-4/conversion-services/ConversionActuatorService';
import { inject, injectable } from 'inversify';

@injectable()
export class ActuatorService extends SharedActuatorService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ActuatorRepo) actuatorRepo: ActuatorRepo,
    @inject(ProjectEntityLastIdRepo) lastIdRepo: ProjectEntityLastIdRepo,
    @inject(BoxRepo) boxRepo: BoxRepo,
    @inject(ConversionActuatorService)
    private readonly conversionService: ConversionActuatorService
  ) {
    super(projectRepo, actuatorRepo, lastIdRepo, boxRepo);
  }

  public async remove(actuator: Actuator): Promise<boolean> {
    const isRemoved = super.remove(actuator);

    if (isRemoved)
      await this.conversionService
        .getAll(actuator.projectId)
        .then(conversions => conversions.filter(isChildOf(actuator)))
        .then(conversions => conversions.forEach(this.conversionService.remove));

    return isRemoved;
  }
}

function isChildOf(actuator: Actuator) {
  return conversion => conversion.parentId === actuator.id;
}
