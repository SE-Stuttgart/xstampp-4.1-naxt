import { FeedbackService as SharedFeedbackService } from '@src-shared/control-structure/services/information-flow/FeedbackService';
import { ArrowRepo, FeedbackRepo, ProjectEntityLastIdRepo, ProjectRepo } from '@stpa/src/main/repositories';
import { inject, injectable } from 'inversify';

@injectable()
export class FeedbackService extends SharedFeedbackService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(FeedbackRepo) feedbackRepo: FeedbackRepo,
    @inject(ProjectEntityLastIdRepo) lastIdRepo: ProjectEntityLastIdRepo,
    @inject(ArrowRepo) arrowRepo: ArrowRepo
  ) {
    super(projectRepo, feedbackRepo, lastIdRepo, arrowRepo);
  }
}
