import { Recommendation } from '@cast/src/main/models';
import { RecommendationService, RecommendationTableModel } from '@cast/src/main/services';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class RecommendationsController {
  constructor(@inject(RecommendationService) private readonly recommendationService: RecommendationService) {}

  public async createRecommendation(projectId: string): Promise<Recommendation> {
    return this.recommendationService.create({ ...new Recommendation(), projectId });
  }

  public async updateRecommendation(recommendation: Recommendation): Promise<Recommendation> {
    return this.recommendationService.update(recommendation);
  }

  public async removeRecommendation(recommendation: Recommendation): Promise<boolean> {
    return this.recommendationService.remove(recommendation);
  }

  public getAll$(projectId: string): Observable<RecommendationTableModel[]> {
    return this.recommendationService.getAllTableModels$(projectId);
  }
}
