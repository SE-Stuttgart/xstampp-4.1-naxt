import { SystemConstraint } from '@stpa/src/main/models';
import {
  ProjectEntityLastIdRepo,
  ProjectRepo,
  SubSystemConstraintRepo,
  SystemConstraintRepo,
} from '@stpa/src/main/repositories';
import { SubSystemConstraintService } from '@stpa/src/main/services/step-1/SubSystemConstraintService';
import { ResponsibilitySystemConstraintLinkService } from '@stpa/src/main/services/link-services/ResponsibilitySystemConstraintLinkService';
import { HazardSystemConstraintLinkService } from '@stpa/src/main/services/link-services/HazardSystemConstraintLinkService';
import { SystemConstraintTableEntry } from '@stpa/src/main/services/models';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectDependentService } from '../common/ProjectDependentService';

@injectable()
export class SystemConstraintService extends ProjectDependentService<SystemConstraint> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ProjectEntityLastIdRepo) lastIdRepo: ProjectEntityLastIdRepo,

    @inject(SystemConstraintRepo)
    private readonly systemConstraintRepo: SystemConstraintRepo,
    @inject(SubSystemConstraintService)
    private readonly subSystemConstraintService: SubSystemConstraintService,
    @inject(HazardSystemConstraintLinkService)
    private readonly hazardLinkService: HazardSystemConstraintLinkService,
    @inject(ResponsibilitySystemConstraintLinkService)
    private readonly responsibilityLinkService: ResponsibilitySystemConstraintLinkService
  ) {
    super(SystemConstraint, projectRepo, systemConstraintRepo, lastIdRepo);
  }

  async remove(systemConstraint: SystemConstraint): Promise<boolean> {
    const isRemoved = super.remove(systemConstraint);

    if (isRemoved) {
      const { projectId, id } = systemConstraint;

      await this.subSystemConstraintService
        .getAll(projectId)
        .then(subSystemConstraints => subSystemConstraints.filter(hasParentId(id)))
        .then(subSystemConstraints => subSystemConstraints.forEach(this.subSystemConstraintService.remove));
      await this.hazardLinkService.removeAllBySystemConstraintId(projectId, id);
      await this.responsibilityLinkService.removeAllBySystemConstraintId(projectId, id);
    }

    return isRemoved;
  }

  public getAllTableEntries$(projectId: string): Observable<SystemConstraintTableEntry[]> {
    return combineLatest([
      this.systemConstraintRepo.findAll$(projectId),
      this.hazardLinkService.getHazardChipMapBySystemConstraintIds$(projectId),
    ]).pipe(
      map(next => {
        const [systemConstraints, hazardChipMap] = next;
        return systemConstraints.map(
          systemConstraint => new SystemConstraintTableEntry(systemConstraint, hazardChipMap.get(systemConstraint.id))
        );
      })
    );
  }
}

function hasParentId(id: number) {
  return subSystemConstraint => subSystemConstraint.parentId === id;
}
