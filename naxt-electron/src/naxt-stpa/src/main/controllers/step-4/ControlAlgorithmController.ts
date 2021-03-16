import { Controller } from '@src-shared/control-structure/models';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';
import { Rule } from '../../models';
import { ControlAlgorithmService } from '../../services';
import { ControlAlgorithmTableEntry } from '../../services/models';

@injectable()
export class ControlAlgorithmController {
  constructor(@inject(ControlAlgorithmService) private readonly controlAlgorithmService: ControlAlgorithmService) {}

  public async createRule(rule: Rule): Promise<Rule> {
    return await this.controlAlgorithmService.create(rule);
  }

  public async updateRule(rule: Rule): Promise<Rule | null> {
    return await this.controlAlgorithmService.update(rule);
  }

  public async removeRule(rule: Rule): Promise<boolean> {
    return await this.controlAlgorithmService.remove(rule);
  }

  public getAll$(projectId: string): Observable<ControlAlgorithmTableEntry[]> {
    return this.controlAlgorithmService.getAllTableEntries$(projectId);
  }

  public getRequiredEntries$(projectId: string): Observable<Controller[]> {
    return this.controlAlgorithmService.getRequiredEntries$(projectId);
  }
}
