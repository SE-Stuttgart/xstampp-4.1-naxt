import { injectable, inject } from 'inversify';
import { DescriptionService } from '../common/DescriptionService';
import { SystemDescription } from '../../models';
import { ProjectRepo, SystemDescriptionRepo } from '../../repositories';

@injectable()
export class SystemDescriptionService extends DescriptionService<SystemDescription> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(SystemDescriptionRepo) systemDescriptionRepo: SystemDescriptionRepo
  ) {
    super(SystemDescription, projectRepo, systemDescriptionRepo);
  }
}
