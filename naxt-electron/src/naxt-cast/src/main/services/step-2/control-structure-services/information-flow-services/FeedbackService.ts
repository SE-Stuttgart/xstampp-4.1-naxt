import { RoleInTheAccident } from '@cast/src/main/models';
import { ArrowRepo, FeedbackRepo, LastIdRepo, ProjectRepo, RoleInTheAccidentRepo } from '@cast/src/main/repositories';
import { ChipPrefix } from '@cast/src/main/services/models/Chip';
import { Feedback } from '@src-shared/control-structure/models';
import { FeedbackService as SharedFeedbackService } from '@src-shared/control-structure/services/information-flow/FeedbackService';
import { InformationFlowType } from '@src-shared/Enums';
import { inject, injectable } from 'inversify';
import { v4 as uuidV4 } from 'uuid';

@injectable()
export class FeedbackService extends SharedFeedbackService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(FeedbackRepo) controlActionRepo: FeedbackRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(RoleInTheAccidentRepo) private readonly roleInTheAccidentRepo: RoleInTheAccidentRepo,
    @inject(ArrowRepo) arrowRepo: ArrowRepo
  ) {
    super(projectRepo, controlActionRepo, lastIdRepo, arrowRepo);
  }

  async create(feedback: Feedback): Promise<Feedback> {
    const _feedback = await super.create(feedback);
    await this.roleInTheAccidentRepo.insert({
      ...new RoleInTheAccident(),
      id: uuidV4(),
      projectId: _feedback.projectId,
      componentId: _feedback.id,
      componentType: InformationFlowType.Feedback,
      label: `${ChipPrefix.Feedback}${_feedback.id}`,
      name: `role in the accident for ${ChipPrefix.Feedback}${_feedback.id}`,
    });
    return _feedback;
  }

  public async remove(feedback: Feedback): Promise<boolean> {
    const { projectId, id } = feedback;
    await this.roleInTheAccidentRepo.removeByComponentId(projectId, id, InformationFlowType.Feedback);
    return super.remove(feedback);
  }
}
