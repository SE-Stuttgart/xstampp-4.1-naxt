import { NAXTError } from '@src-shared/errors/NaxtError';
import { ResponsibilitySubSystemConstraintLink } from '@stpa/src/main/models';
import {
  ProjectRepo,
  ResponsibilityRepo,
  ResponsibilitySubSystemConstraintLinkRepo,
  ResponsibilitySystemConstraintLinkRepo,
  SubSystemConstraintRepo,
} from '@stpa/src/main/repositories';
import { LinkService } from '@stpa/src/main/services/common/LinkService';
import { ChipMap } from '@stpa/src/main/services/util/chips/ChipMap';
import { toSubSystemConstraintChipMapByResponsibilityId } from '@stpa/src/main/services/util/chips/toChipMap';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@injectable()
export class ResponsibilitySubSystemConstraintLinkService extends LinkService<ResponsibilitySubSystemConstraintLink> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ResponsibilitySubSystemConstraintLinkRepo)
    private readonly linkRepo: ResponsibilitySubSystemConstraintLinkRepo,
    @inject(ResponsibilitySystemConstraintLinkRepo)
    private readonly parentLinkRepo: ResponsibilitySystemConstraintLinkRepo,
    @inject(ResponsibilityRepo)
    private readonly responsibilityRepo: ResponsibilityRepo,
    @inject(SubSystemConstraintRepo)
    private readonly subSystemConstraintRepo: SubSystemConstraintRepo
  ) {
    super(ResponsibilitySubSystemConstraintLink, projectRepo, linkRepo);
  }

  public async create(
    link: ResponsibilitySubSystemConstraintLink
  ): Promise<ResponsibilitySubSystemConstraintLink | null> {
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  private async checkCreationRules(link: ResponsibilitySubSystemConstraintLink): Promise<void> {
    const { projectId, systemConstraintId, subSystemConstraintId, responsibilityId } = link;

    const responsibilityExists = await this.responsibilityRepo.exists(projectId, responsibilityId);
    if (!responsibilityExists) throw new NAXTError('No such [responsibility] exists:', link);

    const subSystemConstraintExists = await this.subSystemConstraintRepo.exists(
      projectId,
      systemConstraintId,
      subSystemConstraintId
    );
    if (!subSystemConstraintExists) throw new NAXTError('No such [sub system constraint] exists:', link);
  }

  async removeAllByResponsibilityId(
    projectId: string,
    responsibilityId: number
  ): Promise<ResponsibilitySubSystemConstraintLink[]> {
    return this.linkRepo.removeAllByResponsibilityId(projectId, responsibilityId);
  }

  async removeAllBySubSystemConstraintId(
    projectId: string,
    systemConstraintId: number,
    subSystemConstraintId: number
  ): Promise<ResponsibilitySubSystemConstraintLink[]> {
    return this.linkRepo.removeAllBySubSystemConstraintId(projectId, systemConstraintId, subSystemConstraintId);
  }

  public getAllSubSystemConstraintsAsChipsMappedByResponsibilityIds$(projectId: string): Observable<ChipMap> {
    const responsibilities$ = this.responsibilityRepo.findAll$(projectId);
    const subSystemConstraints$ = this.subSystemConstraintRepo.findAll$(projectId);
    const links$ = this.linkRepo.findAll$(projectId);
    const parentLinks$ = this.parentLinkRepo.findAll$(projectId);

    const selectableSubSystemConstraints$ = combineLatest([parentLinks$, subSystemConstraints$]).pipe(
      map(([parentLinks, subSystemConstraints]) => {
        const systemConstraintLinkIds = parentLinks.map(link => link.systemConstraintId);
        return subSystemConstraints.filter(subSystemConstraint =>
          systemConstraintLinkIds.includes(subSystemConstraint.parentId)
        );
      })
    );

    return toSubSystemConstraintChipMapByResponsibilityId(selectableSubSystemConstraints$, responsibilities$, links$);
  }
}
