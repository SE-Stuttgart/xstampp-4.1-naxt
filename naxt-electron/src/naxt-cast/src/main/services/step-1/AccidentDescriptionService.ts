import { AccidentDescription } from '@cast/src/main/models';
import { AccidentDescriptionRepo, ProjectRepo } from '@cast/src/main/repositories';
import { DescriptionService } from '@cast/src/main/services/common/DescriptionService';
import { inject, injectable } from 'inversify';

@injectable()
export class AccidentDescriptionService extends DescriptionService<AccidentDescription> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(AccidentDescriptionRepo) descriptionRepo: AccidentDescriptionRepo
  ) {
    super(AccidentDescription, projectRepo, descriptionRepo);
  }
}
