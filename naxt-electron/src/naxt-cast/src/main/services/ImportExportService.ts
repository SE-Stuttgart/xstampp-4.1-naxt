/* eslint-disable prettier/prettier */
/* eslint-disable */
import { AllReposService } from '@cast/src/main/services/helper-services/AllReposService';
import { CastProject } from '@cast/src/main/services/models';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { ProjectId } from '@src-shared/Interfaces';
import { Project } from '@src-shared/project/Project';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class ImportExportService {
  constructor(@inject(AllReposService) private readonly _: AllReposService) {}

  public async import(project: Project, castProject: CastProject): Promise<Project> {
    const { projectId } = project;

    const promises = [];
    const toProjectId = createToProjectIdFunction(projectId);
    function add<T extends ProjectId>(objs: T[], repo: Repository<T>): void {
      promises.push(repo.insertAll(toProjectId(objs)));
    }

    promises.push(
      this._.accidentDescriptionRepo.update({ ...castProject.accidentDescription, projectId }),
      this._.changesAndDynamicsOverTimeDescriptionRepo.update({
        ...castProject.changesAndDynamicsOverTimeDescription,
        projectId,
      }),
      this._.communicationAndCoordinationDescriptionRepo.update({
        ...castProject.communicationAndCoordinationDescription,
        projectId,
      }),
      this._.internalAndExternalEconomicsDescriptionRepo.update({
        ...castProject.internalAndExternalEconomicsDescription,
        projectId,
      }),
      this._.safetyCultureDescriptionRepo.update({ ...castProject.safetyCultureDescription, projectId }),
      this._.safetyInformationSystemDescriptionRepo.update({
        ...castProject.safetyInformationSystemDescription,
        projectId,
      }),
      this._.safetyManagementSystemDescriptionRepo.update({
        ...castProject.safetyManagementSystemDescription,
        projectId,
      }),
      this._.systemDescriptionRepo.update({ ...castProject.systemDescription, projectId }),
      this._.otherFactorsRepo.update({ ...castProject.otherFactors, projectId }),
      this._.vectorGraphicRepo.update({ ...castProject.vectorGraphic, projectId })
    );

    add(castProject.actuators, this._.actuatorRepo);
    add(castProject.arrows, this._.arrowRepo);
    add(castProject.boxes, this._.boxRepo);
    add(castProject.changesAndDynamicsOverTimeControllerLinks, this._.changesAndDynamicsOverTimeControllerLinkRepo);
    add(castProject.changesAndDynamicsOverTimes, this._.changesAndDynamicsOverTimeRepo);
    add(castProject.communicationAndCoordination, this._.communicationAndCoordinationRepo);
    add(
      castProject.communicationAndCoordinationController1Links,
      this._.communicationAndCoordinationController1LinkRepo
    );
    add(
      castProject.communicationAndCoordinationController2Links,
      this._.communicationAndCoordinationController2LinkRepo
    );
    add(castProject.constraintHazardLinks, this._.constraintHazardLinkRepo);
    add(castProject.constraintResponsibilityLinks, this._.constraintResponsibilityLinkRepo);
    add(castProject.constraints, this._.constraintRepo);
    add(castProject.controlActions, this._.controlActionRepo);
    add(castProject.controlledProcesses, this._.controlledProcessRepo);
    add(castProject.controllerResponsibilityLinks, this._.controllerResponsibilityLinkRepo);
    add(castProject.controllers, this._.controllerRepo);
    add(castProject.events, this._.eventRepo);
    add(castProject.feedback, this._.feedbackRepo);
    add(castProject.hazards, this._.hazardRepo);
    add(castProject.inputs, this._.inputRepo);
    add(castProject.internalAndExternalEconomics, this._.internalAndExternalEconomicsRepo);
    add(castProject.internalAndExternalEconomicsControllerLinks, this._.internalAndExternalEconomicsControllerLinkRepo);
    add(castProject.lastIdEntries, this._.lastIdRepo);
    add(castProject.outputs, this._.outputRepo);
    add(castProject.processVariables, this._.processVariableRepo);
    add(castProject.questionAndAnswers, this._.questionAndAnswersRepo);
    add(castProject.questionComponentLinks, this._.questionComponentLinkRepo);
    add(castProject.recommendations, this._.recommendationRepo);
    add(castProject.responsibilities, this._.responsibilityRepo);
    add(castProject.roleInTheAccidents, this._.roleInTheAccidentRepo);
    add(castProject.safetyCultureControllerLinks, this._.safetyCultureControllerLinkRepo);
    add(castProject.safetyCultures, this._.safetyCultureRepo);
    add(castProject.safetyInformationSystemControllerLinks, this._.safetyInformationSystemControllerLinkRepo);
    add(castProject.safetyInformationSystems, this._.safetyInformationSystemRepo);
    add(castProject.safetyManagementSystemControllerLinks, this._.safetyManagementSystemControllerLinkRepo);
    add(castProject.safetyManagementSystems, this._.safetyManagementSystemRepo);
    add(castProject.sensors, this._.sensorRepo);
    add(castProject.subRecommendations, this._.subRecommendationRepo);

    await Promise.all(promises);
    return project;
  }

  public async export(projectId: string): Promise<CastProject> {
    const projectExists = this._.projectRepo.exists(projectId);
    if (!projectExists) throw new NAXTError('No such [project] for export exists.', { projectId: projectId });

    const castProject = newCastProject();

    const promises = [];
    function set<T>(container: T[], repo: Repository<T>): void {
      promises.push(repo.findAll(projectId).then(objects => container.push(...objects)));
    }

    promises.push(
      (async () => (castProject.accidentDescription = await this._.accidentDescriptionRepo.find(projectId)))(),
      (async () =>
        (castProject.changesAndDynamicsOverTimeDescription = await this._.changesAndDynamicsOverTimeDescriptionRepo.find(
          projectId
        )))(),
      (async () =>
        (castProject.communicationAndCoordinationDescription = await this._.communicationAndCoordinationDescriptionRepo.find(
          projectId
        )))(),
      (async () =>
        (castProject.internalAndExternalEconomicsDescription = await this._.internalAndExternalEconomicsDescriptionRepo.find(
          projectId
        )))(),
      (async () =>
        (castProject.safetyCultureDescription = await this._.safetyCultureDescriptionRepo.find(projectId)))(),
      (async () =>
        (castProject.safetyInformationSystemDescription = await this._.safetyInformationSystemDescriptionRepo.find(
          projectId
        )))(),
      (async () =>
        (castProject.safetyManagementSystemDescription = await this._.safetyManagementSystemDescriptionRepo.find(
          projectId
        )))(),
      (async () => (castProject.systemDescription = await this._.systemDescriptionRepo.find(projectId)))(),
      (async () => (castProject.otherFactors = await this._.otherFactorsRepo.find(projectId)))(),
      (async () => (castProject.vectorGraphic = await this._.vectorGraphicRepo.find(projectId)))()
    );

    set(castProject.actuators, this._.actuatorRepo);
    set(castProject.arrows, this._.arrowRepo);
    set(castProject.boxes, this._.boxRepo);
    set(castProject.changesAndDynamicsOverTimeControllerLinks, this._.changesAndDynamicsOverTimeControllerLinkRepo);
    set(castProject.changesAndDynamicsOverTimes, this._.changesAndDynamicsOverTimeRepo);
    set(castProject.communicationAndCoordination, this._.communicationAndCoordinationRepo);
    set(
      castProject.communicationAndCoordinationController1Links,
      this._.communicationAndCoordinationController1LinkRepo
    );
    set(
      castProject.communicationAndCoordinationController2Links,
      this._.communicationAndCoordinationController2LinkRepo
    );
    set(castProject.constraintHazardLinks, this._.constraintHazardLinkRepo);
    set(castProject.constraintResponsibilityLinks, this._.constraintResponsibilityLinkRepo);
    set(castProject.constraints, this._.constraintRepo);
    set(castProject.controlActions, this._.controlActionRepo);
    set(castProject.controlledProcesses, this._.controlledProcessRepo);
    set(castProject.controllerResponsibilityLinks, this._.controllerResponsibilityLinkRepo);
    set(castProject.controllers, this._.controllerRepo);
    set(castProject.events, this._.eventRepo);
    set(castProject.feedback, this._.feedbackRepo);
    set(castProject.hazards, this._.hazardRepo);
    set(castProject.inputs, this._.inputRepo);
    set(castProject.internalAndExternalEconomics, this._.internalAndExternalEconomicsRepo);
    set(castProject.internalAndExternalEconomicsControllerLinks, this._.internalAndExternalEconomicsControllerLinkRepo);
    set(castProject.lastIdEntries, this._.lastIdRepo);
    set(castProject.outputs, this._.outputRepo);
    set(castProject.processVariables, this._.processVariableRepo);
    set(castProject.questionAndAnswers, this._.questionAndAnswersRepo);
    set(castProject.questionComponentLinks, this._.questionComponentLinkRepo);
    set(castProject.recommendations, this._.recommendationRepo);
    set(castProject.responsibilities, this._.responsibilityRepo);
    set(castProject.roleInTheAccidents, this._.roleInTheAccidentRepo);
    set(castProject.safetyCultureControllerLinks, this._.safetyCultureControllerLinkRepo);
    set(castProject.safetyCultures, this._.safetyCultureRepo);
    set(castProject.safetyInformationSystemControllerLinks, this._.safetyInformationSystemControllerLinkRepo);
    set(castProject.safetyInformationSystems, this._.safetyInformationSystemRepo);
    set(castProject.safetyManagementSystemControllerLinks, this._.safetyManagementSystemControllerLinkRepo);
    set(castProject.safetyManagementSystems, this._.safetyManagementSystemRepo);
    set(castProject.sensors, this._.sensorRepo);
    set(castProject.subRecommendations, this._.subRecommendationRepo);

    await Promise.all(promises);
    return castProject;
  }
}

function createToProjectIdFunction(projectId: string) {
  return function toProjectId<T extends ProjectId>(objs: T[]): T[] {
    return objs.map(obj => {
      obj.projectId = projectId;
      return obj;
    });
  };
}

function newCastProject(): CastProject {
  return {
    systemDescription: undefined,
    accidentDescription: undefined,
    actuators: [],
    arrows: [],
    boxes: [],
    changesAndDynamicsOverTimeControllerLinks: [],
    changesAndDynamicsOverTimeDescription: undefined,
    changesAndDynamicsOverTimes: [],
    communicationAndCoordination: [],
    communicationAndCoordinationController1Links: [],
    communicationAndCoordinationController2Links: [],
    communicationAndCoordinationDescription: undefined,
    constraintHazardLinks: [],
    constraintResponsibilityLinks: [],
    constraints: [],
    controlActions: [],
    controlledProcesses: [],
    controllerResponsibilityLinks: [],
    controllers: [],
    events: [],
    feedback: [],
    hazards: [],
    inputs: [],
    internalAndExternalEconomics: [],
    internalAndExternalEconomicsControllerLinks: [],
    internalAndExternalEconomicsDescription: undefined,
    lastIdEntries: [],
    otherFactors: undefined,
    outputs: [],
    processVariables: [],
    questionAndAnswers: [],
    questionComponentLinks: [],
    recommendations: [],
    responsibilities: [],
    roleInTheAccidents: [],
    safetyCultureControllerLinks: [],
    safetyCultureDescription: undefined,
    safetyCultures: [],
    safetyInformationSystemControllerLinks: [],
    safetyInformationSystemDescription: undefined,
    safetyInformationSystems: [],
    safetyManagementSystemControllerLinks: [],
    safetyManagementSystemDescription: undefined,
    safetyManagementSystems: [],
    sensors: [],
    subRecommendations: [],
    vectorGraphic: undefined,
  };
}
