import { Arrow } from '@src-shared/control-structure/models';
import { Feedback } from '@src-shared/control-structure/models/information-flow/Feedback';
import { Service } from '@src-shared/control-structure/services/common/Service';
import { updateArrowsWithNewName } from '@src-shared/control-structure/services/util/UpdateArrowsWithNewName';
import { NextId, UnchangedSavesSetter } from '@src-shared/Interfaces';
import { Project } from '@src-shared/project/Project';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { injectable, unmanaged } from 'inversify';

@injectable()
export class FeedbackService extends Service<Feedback> {
  constructor(
    @unmanaged() projectRepo: Repository<Project> & UnchangedSavesSetter,
    @unmanaged() private readonly feedbackRepo: Repository<Feedback>,
    @unmanaged() lastIdRepo: NextId<Feedback>,
    @unmanaged() private readonly arrowRepo: Repository<Arrow>
  ) {
    super(Feedback, projectRepo, feedbackRepo, lastIdRepo);
  }

  public async update(feedback: Feedback): Promise<Feedback | null> {
    const oldFeedback = await this.feedbackRepo._find({
      ...new Feedback(),
      projectId: feedback.projectId,
      id: feedback.id,
    });
    await updateArrowsWithNewName(oldFeedback, feedback, this.arrowRepo);
    return super.update(feedback);
  }
}
