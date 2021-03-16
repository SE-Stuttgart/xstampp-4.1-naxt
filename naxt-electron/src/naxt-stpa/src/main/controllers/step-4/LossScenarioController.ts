import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';
import { LossScenario } from '../../models';
import { LossScenarioService } from '../../services';
import { LossScenarioTableEntry, RequiredModels } from '../../services/models';

@injectable()
export class LossScenarioController {
  constructor(@inject(LossScenarioService) private readonly lossScenarioService: LossScenarioService) {}

  public async create(implementationConstraint: LossScenario): Promise<LossScenario> {
    return await this.lossScenarioService.create(implementationConstraint);
  }

  public async update(implementationConstraint: LossScenario): Promise<LossScenario | null> {
    return await this.lossScenarioService.update(implementationConstraint);
  }

  public async remove(implementationConstraint: LossScenario): Promise<boolean> {
    return await this.lossScenarioService.remove(implementationConstraint);
  }

  public getAll$(projectId: string): Observable<LossScenarioTableEntry[]> {
    return this.lossScenarioService.getAllTableEntries$(projectId);
  }

  public getRequiredEntries$(projectId: string): Observable<RequiredModels> {
    return this.lossScenarioService.getRequiredEntries$(projectId);
  }
}
