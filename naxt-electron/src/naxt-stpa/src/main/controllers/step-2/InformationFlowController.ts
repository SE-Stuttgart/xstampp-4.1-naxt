import { InformationFlowController as SharedInformationFlowController } from '@src-shared/control-structure/controller/InformationFlowController';
import { ControlActionService, FeedbackService, InputService, OutputService } from '@stpa/src/main/services';
import { InformationFlowTableEntry } from '@stpa/src/main/services/models';
import { InformationFlowService } from '@stpa/src/main/services/step-2/control-structure/InformationFlowService';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class InformationFlowController extends SharedInformationFlowController {
  constructor(
    @inject(ControlActionService) controlActionService: ControlActionService,
    @inject(FeedbackService) feedbackService: FeedbackService,
    @inject(InputService) inputService: InputService,
    @inject(OutputService) outputService: OutputService,
    @inject(InformationFlowService) private readonly informationFlowService: InformationFlowService
  ) {
    super(controlActionService, feedbackService, inputService, outputService);
  }

  public getAll$(projectId: string): Observable<InformationFlowTableEntry[]> {
    return this.informationFlowService.getAllTableEntries$(projectId);
  }
}
