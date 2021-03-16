import { Controller } from '@src-shared/control-structure/models';
import { ProcessModel } from '@stpa/src/main/models';
import { ProcessModelService } from '@stpa/src/main/services';
import { ProcessModelTableEntry } from '@stpa/src/main/services/models';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class ProcessModelController {
  constructor(@inject(ProcessModelService) private readonly processModelService: ProcessModelService) {}

  public async createProcessModel(processModel: ProcessModel): Promise<ProcessModel> {
    return await this.processModelService.create(processModel);
  }

  public async updateProcessModel(processModel: ProcessModel): Promise<ProcessModel | null> {
    return await this.processModelService.update(processModel);
  }

  public async removeProcessModel(processModel: ProcessModel): Promise<boolean> {
    return await this.processModelService.remove(processModel);
  }

  public getAll$(projectId: string): Observable<ProcessModelTableEntry[]> {
    return this.processModelService.getAllTableEntries$(projectId);
  }

  public getRequiredEntries$(projectId: string): Observable<Controller[]> {
    return this.processModelService.getRequiredEntries$(projectId);
  }
}
