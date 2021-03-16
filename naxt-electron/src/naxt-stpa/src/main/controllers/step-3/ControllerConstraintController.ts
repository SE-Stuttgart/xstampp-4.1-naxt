import { ControllerConstraint } from '@stpa/src/main/models';
import { ControllerConstraintTableEntry } from '@stpa/src/main/services/models';
import { ControllerConstraintService } from '@stpa/src/main/services/step-3/ControllerConstraintService';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class ControllerConstraintController {
  constructor(
    @inject(ControllerConstraintService) private readonly controllerConstraintService: ControllerConstraintService
  ) {}

  public async updateControllerConstraint(
    controllerConstraint: ControllerConstraint
  ): Promise<ControllerConstraint | null> {
    return await this.controllerConstraintService.update(controllerConstraint);
  }

  public getAll$(projectId: string): Observable<ControllerConstraintTableEntry[]> {
    return this.controllerConstraintService.getAllTableEntries$(projectId);
  }
}
