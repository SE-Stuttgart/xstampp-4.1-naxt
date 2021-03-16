import {
  AccidentDescription,
  ChangesAndDynamicsOverTimeDescription,
  CommunicationAndCoordinationDescription,
  InternalAndExternalEconomicsDescription,
  OtherFactors,
  SafetyCultureDescription,
  SafetyInformationSystemDescription,
  SafetyManagementSystemDescription,
  SystemDescription,
} from '@cast/src/main/models';
import { ProjectRepo } from '@cast/src/main/repositories';
import { AllReposService } from '@cast/src/main/services/helper-services/AllReposService';
import { VectorGraphic } from '@src-shared/control-structure/models';
import { Project } from '@src-shared/project/Project';
import { ProjectService as SharedProjectService } from '@src-shared/project/ProjectService';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class ProjectService extends SharedProjectService {
  constructor(
    @inject(ProjectRepo) projectRepo: Repository<Project>,
    @inject(AllReposService) private readonly _: AllReposService
  ) {
    super(projectRepo);
  }

  public async create(project: Project): Promise<Project> {
    const _project = await super.create(project);
    const { projectId } = _project;
    await Promise.all([
      this._.systemDescriptionRepo.insert({ ...new SystemDescription(), projectId }),
      this._.accidentDescriptionRepo.insert({ ...new AccidentDescription(), projectId }),
      this._.safetyCultureDescriptionRepo.insert({ ...new SafetyCultureDescription(), projectId }),
      this._.safetyInformationSystemDescriptionRepo.insert({ ...new SafetyInformationSystemDescription(), projectId }),
      this._.safetyManagementSystemDescriptionRepo.insert({ ...new SafetyManagementSystemDescription(), projectId }),
      this._.otherFactorsRepo.insert({ ...new OtherFactors(), projectId }),
      this._.vectorGraphicRepo.insert({ ...new VectorGraphic(), projectId }),
      this._.changesAndDynamicsOverTimeDescriptionRepo.insert({
        ...new ChangesAndDynamicsOverTimeDescription(),
        projectId,
      }),
      this._.communicationAndCoordinationDescriptionRepo.insert({
        ...new CommunicationAndCoordinationDescription(),
        projectId,
      }),
      this._.internalAndExternalEconomicsDescriptionRepo.insert({
        ...new InternalAndExternalEconomicsDescription(),
        projectId,
      }),
    ]);
    return _project;
  }

  async remove(project: Project): Promise<boolean> {
    const removed = await super.remove(project);

    if (removed) {
      const { projectId } = project;
      this._.changesAndDynamicsOverTimeDescriptionRepo.removeAll(projectId);
      this._.communicationAndCoordinationDescriptionRepo.removeAll(projectId);
      this._.internalAndExternalEconomicsDescriptionRepo.removeAll(projectId);
      this._.safetyCultureDescriptionRepo.removeAll(projectId);
      this._.safetyInformationSystemDescriptionRepo.removeAll(projectId);
      this._.safetyManagementSystemDescriptionRepo.removeAll(projectId);
      this._.constraintHazardLinkRepo.removeAll(projectId);
      this._.constraintResponsibilityLinkRepo.removeAll(projectId);
      this._.controllerResponsibilityLinkRepo.removeAll(projectId);
      this._.changesAndDynamicsOverTimeControllerLinkRepo.removeAll(projectId);
      this._.communicationAndCoordinationController1LinkRepo.removeAll(projectId);
      this._.internalAndExternalEconomicsControllerLinkRepo.removeAll(projectId);
      this._.safetyCultureControllerLinkRepo.removeAll(projectId);
      this._.safetyInformationSystemControllerLinkRepo.removeAll(projectId);
      this._.safetyManagementSystemControllerLinkRepo.removeAll(projectId);
      this._.controlActionRepo.removeAll(projectId);
      this._.feedbackRepo.removeAll(projectId);
      this._.inputRepo.removeAll(projectId);
      this._.outputRepo.removeAll(projectId);
      this._.actuatorRepo.removeAll(projectId);
      this._.controlledProcessRepo.removeAll(projectId);
      this._.controllerRepo.removeAll(projectId);
      this._.sensorRepo.removeAll(projectId);
      this._.accidentDescriptionRepo.removeAll(projectId);
      this._.arrowRepo.removeAll(projectId);
      this._.boxRepo.removeAll(projectId);
      this._.changesAndDynamicsOverTimeRepo.removeAll(projectId);
      this._.communicationAndCoordinationRepo.removeAll(projectId);
      this._.constraintRepo.removeAll(projectId);
      this._.eventRepo.removeAll(projectId);
      this._.hazardRepo.removeAll(projectId);
      this._.internalAndExternalEconomicsRepo.removeAll(projectId);
      this._.otherFactorsRepo.removeAll(projectId);
      this._.processVariableRepo.removeAll(projectId);
      this._.questionAndAnswersRepo.removeAll(projectId);
      this._.recommendationRepo.removeAll(projectId);
      this._.responsibilityRepo.removeAll(projectId);
      this._.roleInTheAccidentRepo.removeAll(projectId);
      this._.safetyCultureRepo.removeAll(projectId);
      this._.safetyInformationSystemRepo.removeAll(projectId);
      this._.safetyManagementSystemRepo.removeAll(projectId);
      this._.subRecommendationRepo.removeAll(projectId);
      this._.systemDescriptionRepo.removeAll(projectId);
      this._.lastIdRepo.removeAll(projectId);
      this._.questionComponentLinkRepo.removeAll(projectId);
      this._.vectorGraphicRepo.removeAll(projectId);
    }

    return removed;
  }
}
