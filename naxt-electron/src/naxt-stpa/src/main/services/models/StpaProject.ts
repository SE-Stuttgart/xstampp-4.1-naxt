import {
  Actuator,
  Arrow,
  Box,
  ControlAction,
  ControlledProcess,
  Controller,
  ControlStructureProject,
  Feedback,
  Input,
  Output,
  Sensor,
  VectorGraphic,
} from '@src-shared/control-structure/models';
import {
  ControllerConstraint,
  Conversion,
  ConversionLastId,
  ConversionSensor,
  ConversionSensorLastId,
  DiscreteProcessVariableValue,
  Hazard,
  HazardLossLink,
  HazardSystemConstraintLink,
  ImplementationConstraint,
  LinkedDocuments,
  Loss,
  LossScenario,
  ProcessModel,
  ProcessModelProcessVariableLink,
  ProcessVariable,
  ProcessVariableResponsibilityLink,
  ProjectEntityLastId,
  Responsibility,
  ResponsibilitySubSystemConstraintLink,
  ResponsibilitySystemConstraintLink,
  Rule,
  RuleLastId,
  SubHazard,
  SubHazardLastId,
  SubSystemConstraint,
  SubSystemConstraintLastId,
  SystemConstraint,
  SystemDescription,
  UnsafeControlAction,
  UnsafeControlActionHazardLink,
  UnsafeControlActionLastId,
  UnsafeControlActionSubHazardLink,
} from '../../models';

/**
 *  DO NOT CHANGE THE SORTING
 *  XSTAMPP4 web app only accepts this sorting
 */
export interface StpaProject extends ControlStructureProject {
  systemDescription: SystemDescription;

  losses: Loss[];
  hazards: Hazard[];
  systemConstraints: SystemConstraint[];
  subHazards: SubHazard[];
  subSystemConstraints: SubSystemConstraint[];

  controllers: Controller[];
  actuators: Actuator[];
  sensors: Sensor[];
  controlledProcesses: ControlledProcess[];

  controlActions: ControlAction[];
  feedback: Feedback[];
  inputs: Input[];
  outputs: Output[];

  arrows: Arrow[];
  boxes: Box[];

  responsibilities: Responsibility[];

  unsafeControlActions: UnsafeControlAction[];
  controllerConstraints: ControllerConstraint[];

  processModels: ProcessModel[];
  processVariables: ProcessVariable[];
  discreteProcessVariableValues: DiscreteProcessVariableValue[];
  rules: Rule[];
  conversions: Conversion[];
  lossScenarios: LossScenario[];
  implementationConstraints: ImplementationConstraint[];

  unsafeControlActionHazardLinks: UnsafeControlActionHazardLink[];
  unsafeControlActionSubHazardLinks: UnsafeControlActionSubHazardLink[];
  hazardLossLinks: HazardLossLink[];
  hazardSystemConstraintLinks: HazardSystemConstraintLink[];
  responsibilitySystemConstraintLinks: ResponsibilitySystemConstraintLink[];
  processModelProcessVariableLinks: ProcessModelProcessVariableLink[];
  processVariableResponsibilityLinks: ProcessVariableResponsibilityLink[];

  projectEntityLastIds: ProjectEntityLastId[];
  subHazardLastIds: SubHazardLastId[];
  subSystemConstraintLastIds: SubSystemConstraintLastId[];
  unsafeControlActionLastIds: UnsafeControlActionLastId[];
  ruleLastIds: RuleLastId[];
  conversionLastIds: ConversionLastId[];

  // NEW!! not included in XSTAMPP4
  conversionSensors: ConversionSensor[];
  conversionSensorLastIds: ConversionSensorLastId[];
  vectorGraphic: VectorGraphic;
  responsibilitySubSystemConstraintLinks: ResponsibilitySubSystemConstraintLink[];
  linkedDocuments: LinkedDocuments;
}
