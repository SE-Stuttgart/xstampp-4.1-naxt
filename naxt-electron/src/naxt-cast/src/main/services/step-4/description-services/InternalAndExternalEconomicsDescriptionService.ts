import { InternalAndExternalEconomicsDescription } from '@cast/src/main/models';
import { InternalAndExternalEconomicsDescriptionRepo, ProjectRepo } from '@cast/src/main/repositories';
import { DescriptionService } from '@cast/src/main/services/common/DescriptionService';
import { inject, injectable } from 'inversify';

@injectable()
export class InternalAndExternalEconomicsDescriptionService extends DescriptionService<
  InternalAndExternalEconomicsDescription
> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(InternalAndExternalEconomicsDescriptionRepo) descriptionRepo: InternalAndExternalEconomicsDescriptionRepo
  ) {
    super(InternalAndExternalEconomicsDescription, projectRepo, descriptionRepo);
  }
}
