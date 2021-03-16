import { ChangesAndDynamicsOverTimeDescription } from '@cast/src/main/models';
import { ChangesAndDynamicsOverTimeDescriptionRepo, ProjectRepo } from '@cast/src/main/repositories';
import { DescriptionService } from '@cast/src/main/services/common/DescriptionService';
import { inject, injectable } from 'inversify';

@injectable()
export class ChangesAndDynamicsOverTimeDescriptionService extends DescriptionService<
  ChangesAndDynamicsOverTimeDescription
> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ChangesAndDynamicsOverTimeDescriptionRepo) descriptionRepo: ChangesAndDynamicsOverTimeDescriptionRepo
  ) {
    super(ChangesAndDynamicsOverTimeDescription, projectRepo, descriptionRepo);
  }
}
