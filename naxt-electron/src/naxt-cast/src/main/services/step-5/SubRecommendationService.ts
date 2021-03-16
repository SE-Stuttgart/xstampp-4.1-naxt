import { Service } from '@cast/src/main/services/common/Service';
import { ChipPrefix, SubRecommendationTableModel } from '@cast/src/main/services/models';
import { toRecommendationChips } from '@cast/src/main/services/util/toChips';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidV4 } from 'uuid';
import { Recommendation, SubRecommendation } from '../../models';
import { LastIdRepo, ProjectRepo, RecommendationRepo, SubRecommendationRepo } from '../../repositories';

@injectable()
export class SubRecommendationService extends Service<SubRecommendation> {
  constructor(
    @inject(ProjectRepo) private readonly projectRepo: ProjectRepo,
    @inject(LastIdRepo) private readonly lastIdRepo: LastIdRepo,
    @inject(RecommendationRepo) private readonly recommendationRepo: RecommendationRepo,
    @inject(SubRecommendationRepo) private readonly subRecommendationRepo: SubRecommendationRepo
  ) {
    super(SubRecommendation, projectRepo, subRecommendationRepo, lastIdRepo);
  }

  async create(subRecommendation: SubRecommendation): Promise<SubRecommendation> {
    const { projectId, parentId } = subRecommendation;

    const projectExists = await this.projectRepo.exists(projectId);
    if (!projectExists) throw new NAXTError('No such [project] exists:', subRecommendation);

    const recommendation = await this.recommendationRepo.find(projectId, parentId);
    if (!recommendation) throw new NAXTError('No such [recommendation] exists:', subRecommendation);

    await this.projectRepo.setUnsavedChanges(projectId, true);
    const nextId = await this.lastIdRepo.nextId(projectId, SubRecommendation, parentId);
    return this.subRecommendationRepo.insert({
      ...subRecommendation,
      id: uuidV4(),
      label: `${recommendation.label}.${nextId}`,
    });
  }

  public getPossibleParentRecommendations(projectId: string): Observable<Recommendation[]> {
    return this.recommendationRepo.findAll$(projectId).pipe(
      map(recommendations =>
        recommendations
          .map(recommendation => {
            return {
              ...recommendation,
              name: `${ChipPrefix.Recommendation}${recommendation.label} ${recommendation.name}`,
            };
          })
          .sort((r1, r2) => {
            const l1 = String(r1.label);
            const l2 = String(r2.label);
            if (l1 < l2) return -1;
            if (l1 > l2) return 1;
            return 0;
          })
      )
    );
  }

  public getAllTableModels$(projectId: string): Observable<SubRecommendationTableModel[]> {
    return combineLatest([
      this.recommendationRepo.findAll$(projectId),
      this.subRecommendationRepo.findAll$(projectId),
    ]).pipe(
      map(([recommendations, subRecommendations]) => {
        return subRecommendations.map(subRecommendation => {
          const parentRecommendation = recommendations.find(isParentOf(subRecommendation));
          return new SubRecommendationTableModel(
            subRecommendation,
            parentRecommendation,
            toRecommendationChips(recommendations, [parentRecommendation.id])
          );
        });
      })
    );
  }
}

function isParentOf(subRecommendation: SubRecommendation) {
  return recommendation => recommendation.id === subRecommendation.parentId;
}
