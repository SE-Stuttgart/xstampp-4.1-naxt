import { CommunicationAndCoordinationDescription } from '@cast/src/main/models';
import {
  AccidentDescriptionRepo,
  CommunicationAndCoordinationDescriptionRepo,
  ProjectRepo,
} from '@cast/src/main/repositories';
import { DescriptionService } from '@cast/src/main/services/common/DescriptionService';
import { inject, injectable } from 'inversify';

@injectable()
export class CommunicationAndCoordinationDescriptionService extends DescriptionService<
  CommunicationAndCoordinationDescription
> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(CommunicationAndCoordinationDescriptionRepo) descriptionRepo: AccidentDescriptionRepo
  ) {
    super(CommunicationAndCoordinationDescription, projectRepo, descriptionRepo);
  }
}
