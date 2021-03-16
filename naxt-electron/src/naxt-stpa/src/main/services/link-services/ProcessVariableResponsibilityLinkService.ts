import { NAXTError } from '@src-shared/errors/NaxtError';
import { ProcessVariableResponsibilityLink } from '@stpa/src/main/models';
import {
  ProcessVariableRepo,
  ProcessVariableResponsibilityLinkRepo,
  ProjectRepo,
  ResponsibilityRepo,
} from '@stpa/src/main/repositories';
import { LinkService } from '@stpa/src/main/services/common/LinkService';
import { ChipMap } from '@stpa/src/main/services/util/chips/ChipMap';
import { toResponsibilityChipMapByProcessVariableId$ } from '@stpa/src/main/services/util/chips/toChipMap';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@injectable()
export class ProcessVariableResponsibilityLinkService extends LinkService<ProcessVariableResponsibilityLink> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ProcessVariableResponsibilityLinkRepo) private readonly linkRepo: ProcessVariableResponsibilityLinkRepo,
    @inject(ProcessVariableRepo) private readonly processVariableRepo: ProcessVariableRepo,
    @inject(ResponsibilityRepo) private readonly responsibilityRepo: ResponsibilityRepo
  ) {
    super(ProcessVariableResponsibilityLink, projectRepo, linkRepo);
  }

  public async create(link: ProcessVariableResponsibilityLink): Promise<ProcessVariableResponsibilityLink | null> {
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  private async checkCreationRules(link: ProcessVariableResponsibilityLink): Promise<void> {
    const { projectId, responsibilityId, processVariableId } = link;

    const processModelExists = await this.responsibilityRepo.exists(projectId, responsibilityId);
    if (!processModelExists) throw new NAXTError('No such responsibility exists:', link);

    const processVariableExists = await this.processVariableRepo.exists(projectId, processVariableId);
    if (!processVariableExists) throw new NAXTError('No such process variable exists:', link);
  }

  async removeAllByResponsibilityId(
    projectId: string,
    responsibilityId: number
  ): Promise<ProcessVariableResponsibilityLink[]> {
    return this.linkRepo.removeAllByProcessVariableId(projectId, responsibilityId);
  }

  async removeAllByProcessVariableId(
    projectId: string,
    processVariableId: number
  ): Promise<ProcessVariableResponsibilityLink[]> {
    return this.linkRepo.removeAllByProcessVariableId(projectId, processVariableId);
  }

  public getResponsibilityChipMapByProcessVariableIds$(projectId: string): Observable<ChipMap> {
    const responsibilities$ = this.responsibilityRepo.findAll$(projectId);
    const processVariables$ = this.processVariableRepo.findAll$(projectId);
    const links$ = this.linkRepo.findAll$(projectId);
    return combineLatest([
      toResponsibilityChipMapByProcessVariableId$(responsibilities$, processVariables$, links$),
      this.linkRepo.findAll$(projectId),
    ]).pipe(
      map(([chips, links]) => {
        for (const key of chips.map.keys()) {
          const processVariableId = Number(key);
          const alreadyLinked = !!links.find(link => link.processVariableId === processVariableId);
          if (alreadyLinked)
            chips.set(
              key,
              chips.get(processVariableId).filter(chip => chip.selected)
            );
        }
        return chips;
      })
    );
  }
}
