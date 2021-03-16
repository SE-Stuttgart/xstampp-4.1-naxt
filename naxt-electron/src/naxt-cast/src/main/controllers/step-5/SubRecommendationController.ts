import { Recommendation, SubRecommendation } from '@cast/src/main/models';
import { SubRecommendationService, SubRecommendationTableModel } from '@cast/src/main/services';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class SubRecommendationController {
  constructor(@inject(SubRecommendationService) private readonly subRecommendationService: SubRecommendationService) {}

  public async createSubRecommendation(projectId: string, parentId: string): Promise<Recommendation> {
    return this.subRecommendationService.create({ ...new SubRecommendation(), projectId, parentId });
  }

  public async updateSubRecommendation(subRecommendation: SubRecommendation): Promise<Recommendation> {
    return this.subRecommendationService.update(subRecommendation);
  }

  public async removeSubRecommendation(subRecommendation: SubRecommendation): Promise<boolean> {
    return this.subRecommendationService.remove(subRecommendation);
  }

  public getAll$(projectId: string): Observable<SubRecommendationTableModel[]> {
    return this.subRecommendationService.getAllTableModels$(projectId);
  }

  public getPossibleParentRecommendations$(projectId: string): Observable<Recommendation[]> {
    return this.subRecommendationService.getPossibleParentRecommendations(projectId);
  }
}
