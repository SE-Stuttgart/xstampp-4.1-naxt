import { AccidentDescription } from '@cast/src/main/models';
import { AccidentDescriptionService } from '@cast/src/main/services';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class AccidentDescriptionController {
  constructor(
    @inject(AccidentDescriptionService) private readonly accidentDescriptionService: AccidentDescriptionService
  ) {}

  public async update(accidentDescription: AccidentDescription): Promise<AccidentDescription> {
    return this.accidentDescriptionService.update(accidentDescription);
  }

  public async get(projectId: string): Promise<AccidentDescription | null> {
    return this.accidentDescriptionService.get(projectId);
  }

  public get$(projectId: string): Observable<AccidentDescription> {
    return this.accidentDescriptionService.get$(projectId);
  }
}
