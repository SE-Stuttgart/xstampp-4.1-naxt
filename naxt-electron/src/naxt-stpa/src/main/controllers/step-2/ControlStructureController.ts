import { ControlStructureController as SharedControlStructureController } from '@src-shared/control-structure/controller/ControlStructureController';
import {
  ActuatorService,
  ControlActionService,
  ControlledProcessService,
  ControllerService,
  ControlStructureService,
  FeedbackService,
  InputService,
  OutputService,
  SensorService,
} from '@stpa/src/main/services';
import { inject, injectable } from 'inversify';

@injectable()
export class ControlStructureController extends SharedControlStructureController {
  constructor(
    @inject(ControlStructureService) controlStructureService: ControlStructureService,
    @inject(ControlActionService) controlActionService: ControlActionService,
    @inject(FeedbackService) feedbackService: FeedbackService,
    @inject(InputService) inputService: InputService,
    @inject(OutputService) outputService: OutputService,
    @inject(ActuatorService) actuatorService: ActuatorService,
    @inject(ControlledProcessService) controlledProcessService: ControlledProcessService,
    @inject(ControllerService) controllerService: ControllerService,
    @inject(SensorService) sensorService: SensorService
  ) {
    super(
      controlStructureService,
      controlActionService,
      feedbackService,
      inputService,
      outputService,
      actuatorService,
      controlledProcessService,
      controllerService,
      sensorService
    );
  }
}
