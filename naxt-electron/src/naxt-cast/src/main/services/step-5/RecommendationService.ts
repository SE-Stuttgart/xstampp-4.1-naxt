import { Recommendation, SubRecommendation } from '@cast/src/main/models';
import { LastIdRepo, ProjectRepo, RecommendationRepo, SubRecommendationRepo } from '@cast/src/main/repositories';
import { Service } from '@cast/src/main/services/common/Service';
import { RecommendationTableModel } from '@cast/src/main/services/models';
import { toSubRecommendationChips } from '@cast/src/main/services/util/toChips';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@injectable()
export class RecommendationService extends Service<Recommendation> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(RecommendationRepo) private readonly recommendationRepo: RecommendationRepo,
    @inject(SubRecommendationRepo) private readonly subRecommendationRepo: SubRecommendationRepo
  ) {
    super(Recommendation, projectRepo, recommendationRepo, lastIdRepo);
  }

  public getAllTableModels$(projectId: string): Observable<RecommendationTableModel[]> {
    return combineLatest([
      this.recommendationRepo.findAll$(projectId),
      this.subRecommendationRepo.findAll$(projectId),
    ]).pipe(
      map(([recommendations, subRecommendations]) => {
        return recommendations.map(recommendation => {
          const linkedSubRecommendationIds = subRecommendations.filter(isChildOf(recommendation)).map(toId);
          const chips = toSubRecommendationChips(subRecommendations, linkedSubRecommendationIds);
          return new RecommendationTableModel(recommendation, chips);
        });
      })
    );
  }

  public async remove(recommendation: Recommendation): Promise<boolean> {
    const { projectId, id } = recommendation;
    await this.subRecommendationRepo.removeAllForRecommendationId(projectId, id);
    return super.remove(recommendation);
  }
}

function isChildOf(recommendation: Recommendation) {
  return subRecommendation => subRecommendation.parentId === recommendation.id;
}

function toId(subRecommendation: SubRecommendation): string {
  return subRecommendation.id;
}
