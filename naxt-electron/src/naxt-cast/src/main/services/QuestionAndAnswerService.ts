import { Service } from '@cast/src/main/services/common/Service';
import { QuestionComponentLinkService } from '@cast/src/main/services/link-services/QuestionComponentLinkService';
import { QuestionAndAnswerTableModel } from '@cast/src/main/services/models';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { QuestionAndAnswer } from '../models';
import { LastIdRepo, ProjectRepo, QuestionAndAnswersRepo } from '../repositories';

@injectable()
export class QuestionAndAnswerService extends Service<QuestionAndAnswer> {
  constructor(
    @inject(ProjectRepo) private readonly projectRepo: ProjectRepo,
    @inject(LastIdRepo) private readonly lastIdRepo: LastIdRepo,
    @inject(QuestionAndAnswersRepo) private readonly questionAndAnswersRepo: QuestionAndAnswersRepo,
    @inject(QuestionComponentLinkService) private readonly linkService: QuestionComponentLinkService
  ) {
    super(QuestionAndAnswer, projectRepo, questionAndAnswersRepo, lastIdRepo);
  }

  public getAllTableModels$(projectId: string): Observable<QuestionAndAnswerTableModel[]> {
    return combineLatest([
      this.questionAndAnswersRepo.findAll$(projectId),
      this.linkService.getAll$(projectId), // include linked observable (cheap workaround)
    ]).pipe(
      map(([questionsAndAnswers]) => {
        return combineLatest([this.linkService.getComponentChips(projectId)]).pipe(
          map(([chipMap]) => {
            return questionsAndAnswers.map(qna => new QuestionAndAnswerTableModel(qna, chipMap.get(qna.id)));
          })
        );
      }),
      mergeMap(v => v)
    );
  }
}
