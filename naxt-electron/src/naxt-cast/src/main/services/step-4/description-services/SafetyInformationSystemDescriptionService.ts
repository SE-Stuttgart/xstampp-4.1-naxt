import { SafetyInformationSystemDescription } from '@cast/src/main/models';
import { ProjectRepo, SafetyInformationSystemDescriptionRepo } from '@cast/src/main/repositories';
import { DescriptionService } from '@cast/src/main/services/common/DescriptionService';
import { inject, injectable } from 'inversify';

@injectable()
export class SafetyInformationSystemDescriptionService extends DescriptionService<SafetyInformationSystemDescription> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(SafetyInformationSystemDescriptionRepo) descriptionRepo: SafetyInformationSystemDescriptionRepo
  ) {
    super(SafetyInformationSystemDescription, projectRepo, descriptionRepo);
  }
}
