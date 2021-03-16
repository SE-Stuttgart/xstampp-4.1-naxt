import { DescriptionService } from '@cast/src/main/services/common/DescriptionService';
import { inject, injectable } from 'inversify';
import { OtherFactors } from '../../../models';
import { OtherFactorsRepo, ProjectRepo } from '../../../repositories';

@injectable()
export class OtherFactorsService extends DescriptionService<OtherFactors> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(OtherFactorsRepo) private readonly otherFactorsRepo: OtherFactorsRepo
  ) {
    super(OtherFactors, projectRepo, otherFactorsRepo);
  }
}
