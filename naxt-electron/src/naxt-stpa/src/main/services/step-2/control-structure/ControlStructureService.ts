import { ArrowRepo, BoxRepo, ProjectRepo, VectorGraphicRepo } from '@stpa/src/main/repositories';
import { ControlActionService } from '@stpa/src/main/services/step-2/control-structure/information-flow/ControlActionService';
import { FeedbackService } from '@stpa/src/main/services/step-2/control-structure/information-flow/FeedbackService';
import { InputService } from '@stpa/src/main/services/step-2/control-structure/information-flow/InputService';
import { OutputService } from '@stpa/src/main/services/step-2/control-structure/information-flow/OutputService';
import { ActuatorService } from '@stpa/src/main/services/step-2/control-structure/system-components/ActuatorService';
import { ControlledProcessService } from '@stpa/src/main/services/step-2/control-structure/system-components/ControlledProcessService';
import { ControllerService } from '@stpa/src/main/services/step-2/control-structure/system-components/ControllerService';
import { SensorService } from '@stpa/src/main/services/step-2/control-structure/system-components/SensorService';
import { ControlStructureService as SharedControlStructureService } from '@src-shared/control-structure/services/ControlStructureService';
import { inject, injectable } from 'inversify';

@injectable()
export class ControlStructureService extends SharedControlStructureService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ArrowRepo) arrowRepo: ArrowRepo,
    @inject(BoxRepo) boxRepo: BoxRepo,
    @inject(VectorGraphicRepo) vectorGraphicRepo: VectorGraphicRepo,
    @inject(ActuatorService) actuatorService: ActuatorService,
    @inject(ControlledProcessService) controlledProcessService: ControlledProcessService,
    @inject(ControllerService) controllerService: ControllerService,
    @inject(SensorService) sensorService: SensorService,
    @inject(ControlActionService) controlActionService: ControlActionService,
    @inject(FeedbackService) feedbackService: FeedbackService,
    @inject(InputService) inputService: InputService,
    @inject(OutputService) outputService: OutputService
  ) {
    super(
      projectRepo,
      arrowRepo,
      boxRepo,
      vectorGraphicRepo,
      actuatorService,
      controlledProcessService,
      controllerService,
      sensorService,
      controlActionService,
      feedbackService,
      inputService,
      outputService
    );
  }
}
