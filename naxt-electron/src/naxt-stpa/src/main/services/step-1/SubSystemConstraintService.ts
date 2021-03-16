import { NAXTError } from '@src-shared/errors/NaxtError';
import { SubHazard, SubSystemConstraint, SubSystemConstraintLastId, SystemConstraint } from '@stpa/src/main/models';
import { HazardId } from '@stpa/src/main/models/links/Interfaces';
import {
  HazardSystemConstraintLinkRepo,
  ProjectRepo,
  SubHazardRepo,
  SubSystemConstraintLastIdRepo,
  SubSystemConstraintRepo,
  SystemConstraintRepo,
} from '@stpa/src/main/repositories';
import {
  ChipPrefix,
  compareIds,
  NestedModels,
  RequiredModels,
  ResponsibilitySubSystemConstraintLinkService,
  SubSystemConstraintTableEntry,
} from '@stpa/src/main/services/models';
import { toSubHazardChips, toSystemConstraintChips } from '@stpa/src/main/services/util/chips/toChips';
import { toCombinedStringId } from '@stpa/src/main/services/util/chips/toCombinedIds';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityDependentService } from '../common/EntityDependentService';

@injectable()
export class SubSystemConstraintService extends EntityDependentService<
  SubSystemConstraint,
  SystemConstraint,
  SubSystemConstraintLastId
> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(SubSystemConstraintLastIdRepo) lastIdRepo: SubSystemConstraintLastIdRepo,
    @inject(SubSystemConstraintRepo)
    private readonly subSystemConstraintRepo: SubSystemConstraintRepo,
    @inject(SystemConstraintRepo)
    private readonly systemConstraintRepo: SystemConstraintRepo,
    @inject(HazardSystemConstraintLinkRepo)
    private readonly hazardSystemConstraintLinkRepo: HazardSystemConstraintLinkRepo,
    @inject(SubHazardRepo)
    private readonly subHazardRepo: SubHazardRepo,
    @inject(ResponsibilitySubSystemConstraintLinkService)
    private readonly responsibilitySubSystemConstraintLinkService: ResponsibilitySubSystemConstraintLinkService
  ) {
    super(SubSystemConstraint, projectRepo, systemConstraintRepo, subSystemConstraintRepo, lastIdRepo);
  }

  public async create(subSystemConstraint: SubSystemConstraint): Promise<SubSystemConstraint> {
    const { projectId, hazardId, subHazardId } = subSystemConstraint;

    const linkedSubHazardExists = await this.subHazardRepo.exists(projectId, hazardId, subHazardId);
    if (!linkedSubHazardExists) throw new NAXTError('No such [sub hazard] exists:', subSystemConstraint);

    return super.create(subSystemConstraint);
  }

  async remove(subSystemConstraint: SubSystemConstraint): Promise<boolean> {
    const isRemoved = super.remove(subSystemConstraint);
    if (isRemoved)
      await this.responsibilitySubSystemConstraintLinkService.removeAllBySubSystemConstraintId(
        subSystemConstraint.projectId,
        subSystemConstraint.parentId,
        subSystemConstraint.id
      );
    return isRemoved;
  }

  public getRequiredEntries$(projectId: string): Observable<RequiredModels> {
    function isLinkedTo(systemConstraint: SystemConstraint) {
      return link => link.systemConstraintId === systemConstraint.id;
    }

    function toHazardId(link: HazardId): number {
      return link.hazardId;
    }

    function notAlreadyLinked(subSystemConstraints: SubSystemConstraint[]) {
      return (subHazard: SubHazard) => {
        return !subSystemConstraints.find(s => {
          return s.hazardId === subHazard.parentId && s.subHazardId === subHazard.id;
        });
      };
    }

    return combineLatest([
      this.subSystemConstraintRepo.findAll$(projectId),
      this.systemConstraintRepo.findAll$(projectId),
      this.hazardSystemConstraintLinkRepo.findAll$(projectId),
      this.subHazardRepo.findAll$(projectId),
    ]).pipe(
      map(([subSystemConstraints, systemConstraints, hazardSystemConstraintLinks, subHazards]) => {
        const requiredModels = new RequiredModels();
        systemConstraints.forEach(systemConstraint => {
          const relatedHazardIds = hazardSystemConstraintLinks.filter(isLinkedTo(systemConstraint)).map(toHazardId);
          const possibleSubHazards = subHazards
            .filter(subHazard => relatedHazardIds.includes(subHazard.parentId))
            .filter(notAlreadyLinked(subSystemConstraints));
          requiredModels.nestedModels.push(
            new NestedModels(
              systemConstraint,
              ChipPrefix.SystemConstraint,
              SystemConstraint.name,
              possibleSubHazards.map(subHazard => new NestedModels(subHazard, ChipPrefix.SubHazard, SubHazard.name))
            )
          );
        });

        requiredModels.nestedModels.sort(compareIds);
        return requiredModels;
      })
    );
  }

  public getAllTableEntries$(projectId: string): Observable<SubSystemConstraintTableEntry[]> {
    return combineLatest([
      this.subSystemConstraintRepo.findAll$(projectId),
      this.systemConstraintRepo.findAll$(projectId),
      this.subHazardRepo.findAll$(projectId),
    ]).pipe(
      map(([subSystemConstraints, systemConstraints, subHazards]) => {
        return subSystemConstraints.map(subSystemConstraint => {
          const parentSystemConstraint = systemConstraints.find(isParentOf(subSystemConstraint));
          const linkedSubHazard = subHazards.find(isLinkedTo(subSystemConstraint));
          return new SubSystemConstraintTableEntry(
            subSystemConstraint,
            toSystemConstraintChips(systemConstraints, [parentSystemConstraint.id.toString()]),
            toSubHazardChips(subHazards, [toCombinedStringId(linkedSubHazard)])
          );
        });
      })
    );
  }
}

function isLinkedTo(subSystemConstraint: SubSystemConstraint) {
  return subHazard =>
    subHazard.parentId === subSystemConstraint.hazardId && subHazard.id === subSystemConstraint.subHazardId;
}

function isParentOf(subSystemConstraint: SubSystemConstraint) {
  return systemConstraint => systemConstraint.id === subSystemConstraint.parentId;
}
