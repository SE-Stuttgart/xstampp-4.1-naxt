import { ArrowRepo, BoxRepo, ProjectRepo, VectorGraphicRepo } from '@cast/src/main/repositories';
import { ControlActionService } from '@cast/src/main/services/step-2/control-structure-services/information-flow-services/ControlActionService';
import { FeedbackService } from '@cast/src/main/services/step-2/control-structure-services/information-flow-services/FeedbackService';
import { InputService } from '@cast/src/main/services/step-2/control-structure-services/information-flow-services/InputService';
import { OutputService } from '@cast/src/main/services/step-2/control-structure-services/information-flow-services/OutputService';
import { ActuatorService } from '@cast/src/main/services/step-2/control-structure-services/system-component-services/ActuatorService';
import { ControlledProcessService } from '@cast/src/main/services/step-2/control-structure-services/system-component-services/ControlledProcessService';
import { ControllerService } from '@cast/src/main/services/step-2/control-structure-services/system-component-services/ControllerService';
import { SensorService } from '@cast/src/main/services/step-2/control-structure-services/system-component-services/SensorService';
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
