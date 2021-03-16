import { ControlAction, Feedback, Input, Output } from '@src-shared/control-structure/models';
import { ControlActionService } from '@src-shared/control-structure/services/information-flow/ControlActionService';
import { FeedbackService } from '@src-shared/control-structure/services/information-flow/FeedbackService';
import { InputService } from '@src-shared/control-structure/services/information-flow/InputService';
import { OutputService } from '@src-shared/control-structure/services/information-flow/OutputService';

import { injectable, unmanaged } from 'inversify';

@injectable()
export class InformationFlowController {
  constructor(
    @unmanaged() private readonly controlActionService: ControlActionService,
    @unmanaged() private readonly feedbackService: FeedbackService,
    @unmanaged() private readonly inputService: InputService,
    @unmanaged() private readonly outputService: OutputService
  ) {}

  public async createControlAction(projectId: string): Promise<ControlAction> {
    return this.controlActionService.create({ ...new ControlAction(), projectId });
  }

  public async updateControlAction(controlAction: ControlAction): Promise<ControlAction | null> {
    return this.controlActionService.update(controlAction);
  }

  public async removeControlAction(controlAction: ControlAction): Promise<boolean> {
    return this.controlActionService.remove(controlAction);
  }

  public async createFeedback(projectId: string): Promise<Feedback> {
    return this.feedbackService.create({ ...new Feedback(), projectId });
  }

  public async updateFeedback(feedback: Feedback): Promise<Feedback | null> {
    return this.feedbackService.update(feedback);
  }

  public async removeFeedback(feedback: Feedback): Promise<boolean> {
    return this.feedbackService.remove(feedback);
  }

  public async createInput(projectId: string): Promise<Input> {
    return this.inputService.create({ ...new Input(), projectId });
  }

  public async updateInput(input: Input): Promise<Input | null> {
    return this.inputService.update(input);
  }

  public async removeInput(input: Input): Promise<boolean> {
    return this.inputService.remove(input);
  }

  public async createOutput(projectId: string): Promise<Output> {
    return this.outputService.create({ ...new Output(), projectId });
  }

  public async updateOutput(output: Output): Promise<Output | null> {
    return this.outputService.update(output);
  }

  public async removeOutput(output: Output): Promise<boolean> {
    return this.outputService.remove(output);
  }
}
