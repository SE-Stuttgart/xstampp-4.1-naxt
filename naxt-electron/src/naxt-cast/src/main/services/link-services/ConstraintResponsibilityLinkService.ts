import { Constraint, ConstraintResponsibilityLink, Responsibility } from '@cast/src/main/models';
import {
  ConstraintRepo,
  ConstraintResponsibilityLinkRepo,
  ProjectRepo,
  ResponsibilityRepo,
} from '@cast/src/main/repositories';
import { LinkService } from '@cast/src/main/services/common/LinkService';
import { ChipMap } from '@cast/src/main/services/util/ChipMap';
import { toConstraintChipMapByResponsibilityIds$ } from '@cast/src/main/services/util/toChipMap';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class ConstraintResponsibilityLinkService extends LinkService<ConstraintResponsibilityLink> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ConstraintResponsibilityLinkRepo)
    private readonly constraintResponsibilityLinkRepo: ConstraintResponsibilityLinkRepo,
    @inject(ResponsibilityRepo) private readonly responsibilityRepo: ResponsibilityRepo,
    @inject(ConstraintRepo) private readonly constraintRepo: ConstraintRepo
  ) {
    super(ConstraintResponsibilityLink, projectRepo, constraintResponsibilityLinkRepo);
  }

  public async create(link: ConstraintResponsibilityLink): Promise<ConstraintResponsibilityLink> {
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  private async checkCreationRules(link: ConstraintResponsibilityLink): Promise<void> {
    const { projectId, responsibilityId, constraintId } = link;

    const responsibilityExists = await this.responsibilityRepo._exists({
      ...new Responsibility(),
      projectId,
      id: responsibilityId,
    });
    if (!responsibilityExists) throw new NAXTError('No such [responsibility] exists:', link);

    const constraintExists = this.constraintRepo._exists({ ...new Constraint(), projectId, id: constraintId });
    if (!constraintExists) throw new NAXTError('No such [constraint] exists:', link);
  }

  public getConstraintChipMapByResponsibilityIds$(projectId: string): Observable<ChipMap> {
    const constraints$ = this.constraintRepo.findAll$(projectId);
    const responsibilities$ = this.responsibilityRepo.findAll$(projectId);
    const links$ = this.constraintResponsibilityLinkRepo.findAll$(projectId);
    return toConstraintChipMapByResponsibilityIds$(constraints$, responsibilities$, links$);
  }
}
