import {
  DiscreteProcessVariableValue,
  ProcessModelProcessVariableLink,
  ProcessVariable,
  ProcessVariableResponsibilityLink,
} from '@stpa/src/main/models';
import { ProcessVariableTableEntry, RequiredModels } from '@stpa/src/main/services/models';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';
import {
  DiscreteProcessVariableValueService,
  ProcessModelProcessVariableLinkService,
  ProcessVariableResponsibilityLinkService,
  ProcessVariableService,
} from '../../services';

@injectable()
export class ProcessVariableController {
  constructor(
    @inject(ProcessVariableService)
    private readonly processVariableService: ProcessVariableService,
    @inject(ProcessModelProcessVariableLinkService)
    private readonly processModelProcessVariableLinkService: ProcessModelProcessVariableLinkService,
    @inject(ProcessVariableResponsibilityLinkService)
    private readonly processVariableResponsibilityLinkService: ProcessVariableResponsibilityLinkService,
    @inject(DiscreteProcessVariableValueService)
    private readonly discreteProcessVariableValueServiceService: DiscreteProcessVariableValueService
  ) {}

  public async createProcessVariable(processVariable: ProcessVariable): Promise<ProcessVariable> {
    return await this.processVariableService.create(processVariable);
  }

  public async updateProcessVariable(processVariable: ProcessVariable): Promise<ProcessVariable | null> {
    return await this.processVariableService.update(processVariable);
  }

  public async removeProcessVariable(processVariable: ProcessVariable): Promise<boolean> {
    return await this.processVariableService.remove(processVariable);
  }

  public getAll$(projectId: string): Observable<ProcessVariableTableEntry[]> {
    return this.processVariableService.getAllTableEntries$(projectId);
  }

  public getRequiredEntries$(projectId: string): Observable<RequiredModels> {
    return this.processVariableService.getRequiredEntries$(projectId);
  }

  public async createProcessModelLink(link: ProcessModelProcessVariableLink): Promise<ProcessModelProcessVariableLink> {
    return this.processModelProcessVariableLinkService.create(link);
  }

  public async updateProcessModelLink(link: ProcessModelProcessVariableLink): Promise<ProcessModelProcessVariableLink> {
    return this.processModelProcessVariableLinkService.update(link);
  }

  public async removeProcessModelLink(link: ProcessModelProcessVariableLink): Promise<boolean> {
    return this.processModelProcessVariableLinkService.remove(link);
  }

  public async createResponsibilityLink(
    link: ProcessVariableResponsibilityLink
  ): Promise<ProcessVariableResponsibilityLink> {
    return this.processVariableResponsibilityLinkService.create(link);
  }

  public async removeResponsibilityLink(link: ProcessVariableResponsibilityLink): Promise<boolean> {
    return this.processVariableResponsibilityLinkService.remove(link);
  }

  public async createDiscreteValue(value: DiscreteProcessVariableValue): Promise<DiscreteProcessVariableValue> {
    return this.discreteProcessVariableValueServiceService.create(value);
  }

  public async updateDiscreteValue(value: DiscreteProcessVariableValue): Promise<DiscreteProcessVariableValue> {
    return this.discreteProcessVariableValueServiceService.update(value);
  }

  public async removeDiscreteValue(value: DiscreteProcessVariableValue): Promise<boolean> {
    return this.discreteProcessVariableValueServiceService.remove(value);
  }

  public async replaceAllDiscreteValues(
    projectId: string,
    processVariableId: number,
    values: DiscreteProcessVariableValue[]
  ): Promise<{ success: DiscreteProcessVariableValue[]; error: any }> {
    return this.discreteProcessVariableValueServiceService.replaceAll(projectId, processVariableId, values);
  }
}
