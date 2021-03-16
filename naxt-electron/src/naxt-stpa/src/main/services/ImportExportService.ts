/* eslint-disable prettier/prettier */
/* eslint-disable */
import { NAXTError } from '@src-shared/errors/NaxtError';
import { ProjectId } from '@src-shared/Interfaces';
import { Project } from '@src-shared/project/Project';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { AllReposService } from '@stpa/src/main/services/helper-services/AllReposService';
import { StpaProject } from '@stpa/src/main/services/models';
import { inject, injectable } from 'inversify';

@injectable()
export class ImportExportService {
  constructor(@inject(AllReposService) private readonly _: AllReposService) {}

  public async import(project: Project, stpaProject: StpaProject): Promise<Project> {
    const { projectId } = project;

    const promises = [];
    const toProjectId = createToProjectIdFunction(projectId);
    function add<T extends ProjectId>(objs: T[], repo: Repository<T>): void {
      promises.push(repo.insertAll(toProjectId(objs)));
    }

    promises.push(
      this._.systemDescriptionRepo.update({ ...stpaProject.systemDescription, projectId }),
      this._.linkedDocumentsRepo.update({ ...stpaProject.linkedDocuments, projectId }),
      this._.vectorGraphicRepo.update({ ...stpaProject.vectorGraphic, projectId })
    );

    add(stpaProject.actuators, this._.actuatorRepo);
    add(stpaProject.arrows, this._.arrowRepo);
    add(stpaProject.boxes, this._.boxRepo);
    add(stpaProject.controlActions, this._.controlActionRepo);
    add(stpaProject.controlledProcesses, this._.controlledProcessRepo);
    add(stpaProject.controllerConstraints, this._.controllerConstraintRepo);
    add(stpaProject.controllers, this._.controllerRepo);
    add(stpaProject.conversionLastIds, this._.conversionLastIdRepo);
    add(stpaProject.conversions, this._.conversionRepo);
    add(stpaProject.conversionSensorLastIds, this._.conversionSensorLastIdRepo);
    add(stpaProject.conversionSensors, this._.conversionSensorRepo);
    add(stpaProject.discreteProcessVariableValues, this._.discreteProcessVariableValueRepo);
    add(stpaProject.feedback, this._.feedbackRepo);
    add(stpaProject.hazardLossLinks, this._.hazardLossLinkRepo);
    add(stpaProject.hazards, this._.hazardRepo);
    add(stpaProject.hazardSystemConstraintLinks, this._.hazardSystemConstraintLinkRepo);
    add(stpaProject.implementationConstraints, this._.implementationConstraintRepo);
    add(stpaProject.inputs, this._.inputRepo);
    add(stpaProject.losses, this._.lossRepo);
    add(stpaProject.lossScenarios, this._.lossScenarioRepo);
    add(stpaProject.outputs, this._.outputRepo);
    add(stpaProject.processModelProcessVariableLinks, this._.processModelProcessVariableLinkRepo);
    add(stpaProject.processModels, this._.processModelRepo);
    add(stpaProject.processVariableResponsibilityLinks, this._.processVariableResponsibilityLinkRepo);
    add(stpaProject.processVariables, this._.processVariableRepo);
    add(stpaProject.projectEntityLastIds, this._.projectEntityLastIdRepo);
    add(stpaProject.responsibilities, this._.responsibilityRepo);
    add(stpaProject.responsibilitySubSystemConstraintLinks, this._.responsibilitySubSystemConstraintLinkRepo);
    add(stpaProject.responsibilitySystemConstraintLinks, this._.responsibilitySystemConstraintLinkRepo);
    add(stpaProject.ruleLastIds, this._.ruleLastIdRepo);
    add(stpaProject.rules, this._.ruleRepo);
    add(stpaProject.sensors, this._.sensorRepo);
    add(stpaProject.subHazardLastIds, this._.subHazardLastIdRepo);
    add(stpaProject.subHazards, this._.subHazardRepo);
    add(stpaProject.subSystemConstraintLastIds, this._.subSystemConstraintLastIdRepo);
    add(stpaProject.subSystemConstraints, this._.subSystemConstraintRepo);
    add(stpaProject.systemConstraints, this._.systemConstraintRepo);
    add(stpaProject.unsafeControlActionHazardLinks, this._.unsafeControlActionHazardLinkRepo);
    add(stpaProject.unsafeControlActionLastIds, this._.unsafeControlActionLastIdRepo);
    add(stpaProject.unsafeControlActions, this._.unsafeControlActionRepo);
    add(stpaProject.unsafeControlActionSubHazardLinks, this._.unsafeControlActionSubHazardLinkRepo);

    await Promise.all(promises);
    return project;
  }

  public async export(projectId: string): Promise<StpaProject> {
    const projectExists = this._.projectRepo.exists(projectId);
    if (!projectExists) throw new NAXTError('No such [project] for export exists.', { projectId: projectId });

    const stpaProject = newStpaProject();

    const promises = [];
    function set<T>(container: T[], repo: Repository<T>): void {
      promises.push(repo.findAll(projectId).then(objects => container.push(...objects)));
    }

    promises.push(
      (async () => (stpaProject.systemDescription = await this._.systemDescriptionRepo.find(projectId)))(),
      (async () => (stpaProject.linkedDocuments = await this._.linkedDocumentsRepo.find(projectId)))(),
      (async () => (stpaProject.vectorGraphic = await this._.vectorGraphicRepo.find(projectId)))()
    );

    set(stpaProject.actuators, this._.actuatorRepo);
    set(stpaProject.arrows, this._.arrowRepo);
    set(stpaProject.boxes, this._.boxRepo);
    set(stpaProject.controlActions, this._.controlActionRepo);
    set(stpaProject.controlledProcesses, this._.controlledProcessRepo);
    set(stpaProject.controllerConstraints, this._.controllerConstraintRepo);
    set(stpaProject.controllers, this._.controllerRepo);
    set(stpaProject.conversionLastIds, this._.conversionLastIdRepo);
    set(stpaProject.conversionSensorLastIds, this._.conversionSensorLastIdRepo);
    set(stpaProject.conversionSensors, this._.conversionSensorRepo);
    set(stpaProject.conversions, this._.conversionRepo);
    set(stpaProject.discreteProcessVariableValues, this._.discreteProcessVariableValueRepo);
    set(stpaProject.feedback, this._.feedbackRepo);
    set(stpaProject.hazardLossLinks, this._.hazardLossLinkRepo);
    set(stpaProject.hazardSystemConstraintLinks, this._.hazardSystemConstraintLinkRepo);
    set(stpaProject.hazards, this._.hazardRepo);
    set(stpaProject.implementationConstraints, this._.implementationConstraintRepo);
    set(stpaProject.inputs, this._.inputRepo);
    set(stpaProject.lossScenarios, this._.lossScenarioRepo);
    set(stpaProject.losses, this._.lossRepo);
    set(stpaProject.outputs, this._.outputRepo);
    set(stpaProject.processModelProcessVariableLinks, this._.processModelProcessVariableLinkRepo);
    set(stpaProject.processModels, this._.processModelRepo);
    set(stpaProject.processVariableResponsibilityLinks, this._.processVariableResponsibilityLinkRepo);
    set(stpaProject.processVariables, this._.processVariableRepo);
    set(stpaProject.projectEntityLastIds, this._.projectEntityLastIdRepo);
    set(stpaProject.responsibilities, this._.responsibilityRepo);
    set(stpaProject.responsibilitySubSystemConstraintLinks, this._.responsibilitySubSystemConstraintLinkRepo);
    set(stpaProject.responsibilitySystemConstraintLinks, this._.responsibilitySystemConstraintLinkRepo);
    set(stpaProject.ruleLastIds, this._.ruleLastIdRepo);
    set(stpaProject.rules, this._.ruleRepo);
    set(stpaProject.sensors, this._.sensorRepo);
    set(stpaProject.subHazardLastIds, this._.subHazardLastIdRepo);
    set(stpaProject.subHazards, this._.subHazardRepo);
    set(stpaProject.subSystemConstraintLastIds, this._.subSystemConstraintLastIdRepo);
    set(stpaProject.subSystemConstraints, this._.subSystemConstraintRepo);
    set(stpaProject.systemConstraints, this._.systemConstraintRepo);
    set(stpaProject.unsafeControlActionHazardLinks, this._.unsafeControlActionHazardLinkRepo);
    set(stpaProject.unsafeControlActionLastIds, this._.unsafeControlActionLastIdRepo);
    set(stpaProject.unsafeControlActionSubHazardLinks, this._.unsafeControlActionSubHazardLinkRepo);
    set(stpaProject.unsafeControlActions, this._.unsafeControlActionRepo);

    await Promise.all(promises);

    return addNoise(stpaProject);
  }
}

/**
 *  DO NOT CHANGE THE SORTING
 *  XSTAMPP4 web app only accepts this sorting
 */
function newStpaProject(): StpaProject {
  return {
    systemDescription: undefined,

    losses: [],
    hazards: [],
    systemConstraints: [],
    subHazards: [],
    subSystemConstraints: [],

    controllers: [],
    actuators: [],
    sensors: [],
    controlledProcesses: [],

    controlActions: [],
    feedback: [],
    inputs: [],
    outputs: [],

    arrows: [],
    boxes: [],

    responsibilities: [],

    unsafeControlActions: [],
    controllerConstraints: [],

    processModels: [],
    processVariables: [],
    discreteProcessVariableValues: [],
    rules: [],
    conversions: [],
    lossScenarios: [],
    implementationConstraints: [],

    unsafeControlActionHazardLinks: [],
    unsafeControlActionSubHazardLinks: [],
    hazardLossLinks: [],
    hazardSystemConstraintLinks: [],
    responsibilitySystemConstraintLinks: [],
    processModelProcessVariableLinks: [],
    processVariableResponsibilityLinks: [],

    projectEntityLastIds: [],
    subHazardLastIds: [],
    subSystemConstraintLastIds: [],
    unsafeControlActionLastIds: [],
    ruleLastIds: [],
    conversionLastIds: [],

    // NEW!! not included in XSTAMPP4
    conversionSensors: [],
    conversionSensorLastIds: [],
    vectorGraphic: undefined,
    responsibilitySubSystemConstraintLinks: [],
    linkedDocuments: undefined,
  };
}

function createToProjectIdFunction(projectId: string) {
  return function toProjectId<T extends ProjectId>(objs: T[]): T[] {
    if (!objs) return [];
    return objs.map(obj => {
      obj.projectId = projectId;
      return obj;
    });
  };
}

function addNoise(stpaProject: StpaProject) {
  function noise(obj: any) {
    return {
      ...obj,
      lastEditorId: null,
      lastEdited: new Date().getTime(),
      lockHolderId: null,
      lockHolderDisplayName: null,
      lockExpirationTime: null,
    };
  }

  stpaProject.systemDescription = noise(stpaProject.systemDescription);

  stpaProject.losses = stpaProject.losses.map(noise);
  stpaProject.hazards = stpaProject.hazards.map(noise);
  stpaProject.systemConstraints = stpaProject.systemConstraints.map(noise);
  stpaProject.subHazards = stpaProject.subHazards.map(noise);
  stpaProject.subSystemConstraints = stpaProject.subSystemConstraints.map(noise);

  stpaProject.controllers = stpaProject.controllers.map(noise);
  stpaProject.actuators = stpaProject.actuators.map(noise);
  stpaProject.sensors = stpaProject.sensors.map(noise);
  stpaProject.controlledProcesses = stpaProject.controlledProcesses.map(noise);

  stpaProject.controlActions = stpaProject.controlActions.map(noise);
  stpaProject.feedback = stpaProject.feedback.map(noise);
  stpaProject.inputs = stpaProject.inputs.map(noise);
  stpaProject.outputs = stpaProject.outputs.map(noise);

  stpaProject.responsibilities = stpaProject.responsibilities.map(noise);

  stpaProject.unsafeControlActions = stpaProject.unsafeControlActions.map(noise);
  stpaProject.controllerConstraints = stpaProject.controllerConstraints.map(noise);

  stpaProject.processModels = stpaProject.processModels.map(noise);
  stpaProject.processVariables = stpaProject.processVariables.map(noise);
  stpaProject.rules = stpaProject.rules.map(noise);
  stpaProject.conversions = stpaProject.conversions.map(noise);
  stpaProject.lossScenarios = stpaProject.lossScenarios.map(noise);
  stpaProject.implementationConstraints = stpaProject.implementationConstraints.map(noise);

  return stpaProject;
}
