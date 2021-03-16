import { ControlActionRepo, FeedbackRepo, InputRepo, OutputRepo } from '@cast/src/main/repositories';
import {
  ControlActionTableModel,
  FeedbackTableModel,
  InformationFlowTableModel,
  InputTableModel,
  OutputTableModel,
} from '@cast/src/main/services/models';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@injectable()
export class InformationFlowService {
  constructor(
    @inject(ControlActionRepo) private readonly controlActionRepo: ControlActionRepo,
    @inject(FeedbackRepo) private readonly feedbackRepo: FeedbackRepo,
    @inject(InputRepo) private readonly inputRepo: InputRepo,
    @inject(OutputRepo) private readonly outputRepo: OutputRepo
  ) {}

  public getAllTableModels$(projectId: string): Observable<InformationFlowTableModel[]> {
    return combineLatest([
      this.controlActionRepo.findAll$(projectId),
      this.feedbackRepo.findAll$(projectId),
      this.inputRepo.findAll$(projectId),
      this.outputRepo.findAll$(projectId),
    ]).pipe(
      map(([controlActions, feedback, inputs, outputs]) => {
        return [].concat(
          controlActions.map(controlAction => new ControlActionTableModel(controlAction)),
          feedback.map(feedback => new FeedbackTableModel(feedback)),
          inputs.map(input => new InputTableModel(input)),
          outputs.map(output => new OutputTableModel(output))
        );
      })
    );
  }
}
