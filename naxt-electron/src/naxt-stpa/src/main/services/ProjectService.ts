import { VectorGraphic } from '@src-shared/control-structure/models';
import { Project } from '@src-shared/project/Project';
import { ProjectService as SharedProjectService } from '@src-shared/project/ProjectService';
import { LinkedDocuments, SystemDescription } from '@stpa/src/main/models';
import { ProjectRepo } from '@stpa/src/main/repositories';
import { AllReposService } from '@stpa/src/main/services/helper-services/AllReposService';
import { inject, injectable } from 'inversify';

@injectable()
export class ProjectService extends SharedProjectService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(AllReposService) private readonly _: AllReposService
  ) {
    super(projectRepo);
  }

  public async create(project: Project): Promise<Project> {
    const _project = await super.create(project);
    const { projectId } = _project;
    await Promise.all([
      this._.systemDescriptionRepo.insert({ ...new SystemDescription(), projectId }),
      this._.linkedDocumentsRepo.insert({ ...new LinkedDocuments(), projectId }),
      this._.vectorGraphicRepo.insert({ ...new VectorGraphic(), projectId }),
    ]);
    return _project;
  }

  public async remove(project: Project): Promise<boolean> {
    const removed = await super.remove(project);

    if (removed) {
      const { projectId } = project;
      this._.actuatorRepo.removeAll(projectId);
      this._.arrowRepo.removeAll(projectId);
      this._.boxRepo.removeAll(projectId);
      this._.controlActionRepo.removeAll(projectId);
      this._.controlledProcessRepo.removeAll(projectId);
      this._.controllerConstraintRepo.removeAll(projectId);
      this._.controllerRepo.removeAll(projectId);
      this._.conversionLastIdRepo.removeAll(projectId);
      this._.conversionRepo.removeAll(projectId);
      this._.conversionSensorLastIdRepo.removeAll(projectId);
      this._.conversionSensorRepo.removeAll(projectId);
      this._.discreteProcessVariableValueRepo.removeAll(projectId);
      this._.feedbackRepo.removeAll(projectId);
      this._.hazardLossLinkRepo.removeAll(projectId);
      this._.hazardRepo.removeAll(projectId);
      this._.hazardSystemConstraintLinkRepo.removeAll(projectId);
      this._.implementationConstraintRepo.removeAll(projectId);
      this._.inputRepo.removeAll(projectId);
      this._.lossRepo.removeAll(projectId);
      this._.lossScenarioRepo.removeAll(projectId);
      this._.outputRepo.removeAll(projectId);
      this._.processModelProcessVariableLinkRepo.removeAll(projectId);
      this._.processModelRepo.removeAll(projectId);
      this._.processVariableRepo.removeAll(projectId);
      this._.processVariableResponsibilityLinkRepo.removeAll(projectId);
      this._.projectEntityLastIdRepo.removeAll(projectId);
      this._.responsibilityRepo.removeAll(projectId);
      this._.responsibilitySubSystemConstraintLinkRepo.removeAll(projectId);
      this._.responsibilitySystemConstraintLinkRepo.removeAll(projectId);
      this._.ruleLastIdRepo.removeAll(projectId);
      this._.ruleRepo.removeAll(projectId);
      this._.sensorRepo.removeAll(projectId);
      this._.subHazardLastIdRepo.removeAll(projectId);
      this._.subHazardRepo.removeAll(projectId);
      this._.subSystemConstraintLastIdRepo.removeAll(projectId);
      this._.subSystemConstraintRepo.removeAll(projectId);
      this._.systemConstraintRepo.removeAll(projectId);
      this._.systemDescriptionRepo.removeAll(projectId);
      this._.unsafeControlActionHazardLinkRepo.removeAll(projectId);
      this._.unsafeControlActionLastIdRepo.removeAll(projectId);
      this._.unsafeControlActionRepo.removeAll(projectId);
      this._.unsafeControlActionSubHazardLinkRepo.removeAll(projectId);
      this._.vectorGraphicRepo.removeAll(projectId);
    }

    return removed;
  }
}
