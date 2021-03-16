import { NAXTError } from '@src-shared/errors/NaxtError';
import { ProcessModelProcessVariableLink } from '@stpa/src/main/models';
import {
  ProcessModelProcessVariableLinkRepo,
  ProcessModelRepo,
  ProcessVariableRepo,
  ProjectRepo,
} from '@stpa/src/main/repositories';
import { LinkService } from '@stpa/src/main/services/common/LinkService';
import { ChipMap } from '@stpa/src/main/services/util/chips/ChipMap';
import { toProcessModelChipMapByProcessVariableId } from '@stpa/src/main/services/util/chips/toChipMap';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class ProcessModelProcessVariableLinkService extends LinkService<ProcessModelProcessVariableLink> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ProcessModelProcessVariableLinkRepo) private readonly linkRepo: ProcessModelProcessVariableLinkRepo,
    @inject(ProcessModelRepo) private readonly processModelRepo: ProcessModelRepo,
    @inject(ProcessVariableRepo) private readonly processVariableRepo: ProcessVariableRepo
  ) {
    super(ProcessModelProcessVariableLink, projectRepo, linkRepo);
  }

  public async create(link: ProcessModelProcessVariableLink): Promise<ProcessModelProcessVariableLink | null> {
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  private async checkCreationRules(link: ProcessModelProcessVariableLink): Promise<void> {
    const { projectId, processModelId, processVariableId } = link;

    const processModelExists = await this.processModelRepo.exists(projectId, processModelId);
    if (!processModelExists) throw new NAXTError('No such process model exists:', link);

    const processVariableExists = await this.processVariableRepo.exists(projectId, processVariableId);
    if (!processVariableExists) throw new NAXTError('No such process variable exists:', link);
  }

  async removeAllByProcessVariableId(
    projectId: string,
    processVariableId: number
  ): Promise<ProcessModelProcessVariableLink[]> {
    return this.linkRepo.removeAllByProcessVariableId(projectId, processVariableId);
  }

  async removeAllByProcessModelId(
    projectId: string,
    processModelId: number
  ): Promise<ProcessModelProcessVariableLink[]> {
    return this.linkRepo.removeAllByProcessModelId(projectId, processModelId);
  }

  public getProcessModelChipMapByProcessVariableIds$(projectId: string): Observable<ChipMap> {
    const processModels$ = this.processModelRepo.findAll$(projectId);
    const processVariables$ = this.processVariableRepo.findAll$(projectId);
    const links$ = this.linkRepo.findAll$(projectId);
    return toProcessModelChipMapByProcessVariableId(processModels$, processVariables$, links$);
  }
}
