import { SafetyManagementSystemDescription } from '@cast/src/main/models';
import { ProjectRepo, SafetyManagementSystemDescriptionRepo } from '@cast/src/main/repositories';
import { DescriptionService } from '@cast/src/main/services/common/DescriptionService';
import { inject, injectable } from 'inversify';

@injectable()
export class SafetyManagementSystemDescriptionService extends DescriptionService<SafetyManagementSystemDescription> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(SafetyManagementSystemDescriptionRepo) descriptionRepo: SafetyManagementSystemDescriptionRepo
  ) {
    super(SafetyManagementSystemDescription, projectRepo, descriptionRepo);
  }
}
