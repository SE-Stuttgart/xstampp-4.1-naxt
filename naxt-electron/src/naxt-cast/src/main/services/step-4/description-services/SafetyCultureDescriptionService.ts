import { SafetyCultureDescription } from '@cast/src/main/models';
import { ProjectRepo, SafetyCultureDescriptionRepo } from '@cast/src/main/repositories';
import { DescriptionService } from '@cast/src/main/services/common/DescriptionService';
import { inject, injectable } from 'inversify';

@injectable()
export class SafetyCultureDescriptionService extends DescriptionService<SafetyCultureDescription> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(SafetyCultureDescriptionRepo) descriptionRepo: SafetyCultureDescriptionRepo
  ) {
    super(SafetyCultureDescription, projectRepo, descriptionRepo);
  }
}
