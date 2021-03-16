import {
  ControlActionService,
  FeedbackService,
  InformationFlowService,
  InputService,
  OutputService,
} from '@cast/src/main/services';
import { InformationFlowTableModel } from '@cast/src/main/services/models/table-models/step-2/InformationFlowTableModel';
import { InformationFlowController as BasicInformationFlowController } from '@src-shared/control-structure/controller/InformationFlowController';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class InformationFlowController extends BasicInformationFlowController {
  constructor(
    @inject(ControlActionService) controlActionService: ControlActionService,
    @inject(FeedbackService) feedbackService: FeedbackService,
    @inject(InputService) inputService: InputService,
    @inject(OutputService) outputService: OutputService,
    @inject(InformationFlowService) private readonly informationFlowService: InformationFlowService
  ) {
    super(controlActionService, feedbackService, inputService, outputService);
  }

  public getAllTableModels$(projectId: string): Observable<InformationFlowTableModel[]> {
    return this.informationFlowService.getAllTableModels$(projectId);
  }
}
