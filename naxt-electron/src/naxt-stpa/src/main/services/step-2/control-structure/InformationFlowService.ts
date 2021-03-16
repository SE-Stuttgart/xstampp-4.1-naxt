import { ControlAction, Feedback, Input, Output } from '@src-shared/control-structure/models';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ControlActionTableEntry,
  FeedbackTableEntry,
  InformationFlowTableEntry,
  InputTableEntry,
  OutputTableEntry,
} from '../../models';
import { ControlActionService } from './information-flow/ControlActionService';
import { FeedbackService } from './information-flow/FeedbackService';
import { InputService } from './information-flow/InputService';
import { OutputService } from './information-flow/OutputService';

@injectable()
export class InformationFlowService {
  constructor(
    @inject(ControlActionService) private readonly controlActionService: ControlActionService,
    @inject(FeedbackService) private readonly feedbackService: FeedbackService,
    @inject(InputService) private readonly inputService: InputService,
    @inject(OutputService) private readonly outputService: OutputService
  ) {}

  public getAllTableEntries$(projectId: string): Observable<InformationFlowTableEntry[]> {
    return combineLatest([
      this.controlActionService.getAll$(projectId),
      this.feedbackService.getAll$(projectId),
      this.inputService.getAll$(projectId),
      this.outputService.getAll$(projectId),
    ]).pipe(
      map(next => {
        const [controlActions, feedback, inputs, outputs] = next;
        return [].concat(
          controlActions.map(toControlActionTableEntry),
          feedback.map(toFeedbackTableEntry),
          inputs.map(toInputTableEntry),
          outputs.map(toOutputTableEntry)
        );
      })
    );
  }
}

function toControlActionTableEntry(controlAction: ControlAction): ControlActionTableEntry {
  return new ControlActionTableEntry(controlAction);
}

function toFeedbackTableEntry(feedback: Feedback): FeedbackTableEntry {
  return new FeedbackTableEntry(feedback);
}

function toInputTableEntry(input: Input): InputTableEntry {
  return new InputTableEntry(input);
}

function toOutputTableEntry(output: Output): OutputTableEntry {
  return new OutputTableEntry(output);
}
