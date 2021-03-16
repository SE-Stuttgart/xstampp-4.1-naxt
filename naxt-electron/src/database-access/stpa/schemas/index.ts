import { conversionSensorSchema } from '@database-access/stpa/schemas/ConversionSensor';
import { conversionSensorLastIdSchema } from '@database-access/stpa/schemas/last-ids/ConversionSensorLastId';
import { responsibilitySubSystemConstraintLinkSchema } from '@database-access/stpa/schemas/links/ResponsibilitySubSystemConstraintLinkSchema';
import {
  Actuator,
  Arrow,
  Box,
  ControlAction,
  ControlledProcess,
  Controller,
  Feedback,
  Input,
  Output,
  Sensor,
} from '@src-shared/control-structure/models';
import { Project } from '@src-shared/project/Project';
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
} from '@stpa/src/main/models';
import { RxCollection } from 'rxdb';
import { processModelSchema } from './control-structure/ProcessModelSchema';
import { processVariableSchema } from './control-structure/ProcessVariableSchema';
import { controllerConstraintSchema } from './ControllerConstraintSchema';
import { conversionSchema } from './ConversionSchema';
import { discreteProcessVariableValueSchema } from './DiscreteProcessVariableValueSchema';
import { hazardSchema } from './HazardSchema';
import { implementationConstraintSchema } from './ImplementationConstraintSchema';
import { conversionLastIdSchema } from './last-ids/ConversionLastIdSchema';
import { projectEntityLastIdSchema } from './last-ids/ProjectEntityLastIdSchema';
import { ruleLastIdSchema } from './last-ids/RuleLastIdSchema';
import { subHazardLastIdSchema } from './last-ids/SubHazardLastIdSchema';
import { subSystemConstraintLastIdSchema } from './last-ids/SubSystemConstraintLastIdSchema';
import { unsafeControlActionLastIdSchema } from './last-ids/UnsafeControlActionLastIdSchema';
import { hazardLossLinkSchema } from './links/HazardLossLinkSchema';
import { hazardSystemConstraintLinkSchema } from './links/HazardSystemConstraintLinkSchema';
import { processModelProcessVariableLinkSchema } from './links/ProcessModelProcessVariableLinkSchema';
import { processVariableResponsibilityLinkSchema } from './links/ProcessVariableResponsibilityLinkSchema';
import { responsibilitySystemConstraintLinkSchema } from './links/ResponsibilitySystemConstraintLinkSchema';
import { unsafeControlActionHazardLinkSchema } from './links/UnsafeControlActionHazardLinkSchema';
import { unsafeControlActionSubHazardLinkSchema } from './links/UnsafeControlActionSubHazardLinkSchema';
import { lossScenarioSchema } from './LossScenarioSchema';
import { lossSchema } from './LossSchema';
import { responsibilitySchema } from './ResponsibilitySchema';
import { ruleSchema } from './RuleSchema';
import { subHazardSchema } from './SubHazardSchema';
import { subSystemConstraintSchema } from './SubSystemConstraintSchema';
import { systemConstraintSchema } from './SystemConstraintSchema';
import { linkedDocumentsSchema, systemDescriptionSchema } from './SystemDescriptionSchema';
import { unsafeControlActionSchema } from './UnsafeControlActionSchema';

export const stpaCollections = [
  {
    name: ProcessModel.name.toLowerCase(),
    schema: processModelSchema,
  },
  {
    name: ProcessVariable.name.toLowerCase(),
    schema: processVariableSchema,
  },
  //////////////////////////////////////////////////////
  {
    name: ConversionLastId.name.toLowerCase(),
    schema: conversionLastIdSchema,
  },
  {
    name: ConversionSensorLastId.name.toLowerCase(),
    schema: conversionSensorLastIdSchema,
  },
  {
    name: ProjectEntityLastId.name.toLowerCase(),
    schema: projectEntityLastIdSchema,
  },
  {
    name: RuleLastId.name.toLowerCase(),
    schema: ruleLastIdSchema,
  },
  {
    name: SubHazardLastId.name.toLowerCase(),
    schema: subHazardLastIdSchema,
  },
  {
    name: SubSystemConstraintLastId.name.toLowerCase(),
    schema: subSystemConstraintLastIdSchema,
  },
  {
    name: UnsafeControlActionLastId.name.toLowerCase(),
    schema: unsafeControlActionLastIdSchema,
  },
  //////////////////////////////////////////////////////
  {
    name: HazardLossLink.name.toLowerCase(),
    schema: hazardLossLinkSchema,
  },
  {
    name: HazardSystemConstraintLink.name.toLowerCase(),
    schema: hazardSystemConstraintLinkSchema,
  },
  {
    name: ProcessModelProcessVariableLink.name.toLowerCase(),
    schema: processModelProcessVariableLinkSchema,
  },
  {
    name: ProcessVariableResponsibilityLink.name.toLowerCase(),
    schema: processVariableResponsibilityLinkSchema,
  },
  {
    name: ResponsibilitySystemConstraintLink.name.toLowerCase(),
    schema: responsibilitySystemConstraintLinkSchema,
  },
  {
    name: ResponsibilitySubSystemConstraintLink.name.toLowerCase(),
    schema: responsibilitySubSystemConstraintLinkSchema,
  },
  {
    name: UnsafeControlActionHazardLink.name.toLowerCase(),
    schema: unsafeControlActionHazardLinkSchema,
  },
  {
    name: UnsafeControlActionSubHazardLink.name.toLowerCase(),
    schema: unsafeControlActionSubHazardLinkSchema,
  },
  //////////////////////////////////////////////////////
  {
    name: ControllerConstraint.name.toLowerCase(),
    schema: controllerConstraintSchema,
  },
  {
    name: Conversion.name.toLowerCase(),
    schema: conversionSchema,
  },
  {
    name: ConversionSensor.name.toLowerCase(),
    schema: conversionSensorSchema,
  },
  {
    name: DiscreteProcessVariableValue.name.toLowerCase(),
    schema: discreteProcessVariableValueSchema,
  },
  {
    name: Hazard.name.toLowerCase(),
    schema: hazardSchema,
  },
  {
    name: ImplementationConstraint.name.toLowerCase(),
    schema: implementationConstraintSchema,
  },
  {
    name: LossScenario.name.toLowerCase(),
    schema: lossScenarioSchema,
  },
  {
    name: Loss.name.toLowerCase(),
    schema: lossSchema,
  },
  {
    name: Responsibility.name.toLowerCase(),
    schema: responsibilitySchema,
  },
  {
    name: Rule.name.toLowerCase(),
    schema: ruleSchema,
  },
  {
    name: SubHazard.name.toLowerCase(),
    schema: subHazardSchema,
  },
  {
    name: SubSystemConstraint.name.toLowerCase(),
    schema: subSystemConstraintSchema,
  },
  {
    name: SystemConstraint.name.toLowerCase(),
    schema: systemConstraintSchema,
  },
  {
    name: SystemDescription.name.toLowerCase(),
    schema: systemDescriptionSchema,
  },
  {
    name: LinkedDocuments.name.toLowerCase(),
    schema: linkedDocumentsSchema,
  },
  {
    name: UnsafeControlAction.name.toLowerCase(),
    schema: unsafeControlActionSchema,
  },
];

export type StpaDatabaseCollections = {
  actuator: RxCollection<Actuator>;
  controlaction: RxCollection<ControlAction>;
  controlledprocess: RxCollection<ControlledProcess>;
  controller: RxCollection<Controller>;
  feedback: RxCollection<Feedback>;
  input: RxCollection<Input>;
  output: RxCollection<Output>;
  processmodel: RxCollection<ProcessModel>;
  processvariable: RxCollection<ProcessVariable>;
  sensor: RxCollection<Sensor>;
  ////////////////////////////////////////////////////////////////////////////
  conversionlastid: RxCollection<ConversionLastId>;
  projectentitylastid: RxCollection<ProjectEntityLastId>;
  rulelastid: RxCollection<RuleLastId>;
  subhazardlastid: RxCollection<SubHazardLastId>;
  subsystemconstraintlastid: RxCollection<SubSystemConstraintLastId>;
  unsafecontrolactionlastid: RxCollection<UnsafeControlActionLastId>;
  ////////////////////////////////////////////////////////////////////////////
  hazardlosslink: RxCollection<HazardLossLink>;
  hazardsystemconstraintlink: RxCollection<HazardSystemConstraintLink>;
  processmodelprocessvariablelink: RxCollection<ProcessModelProcessVariableLink>;
  processvariableresponsibilitylink: RxCollection<ProcessVariableResponsibilityLink>;
  unsafecontrolactionhazardlink: RxCollection<UnsafeControlActionHazardLink>;
  unsafecontrolactionsubhazardlink: RxCollection<UnsafeControlActionSubHazardLink>;
  ////////////////////////////////////////////////////////////////////////////
  arrow: RxCollection<Arrow>;
  box: RxCollection<Box>;
  controllerconstraint: RxCollection<ControllerConstraint>;
  conversion: RxCollection<Conversion>;
  discreteprocessvariablevalue: RxCollection<DiscreteProcessVariableValue>;
  hazard: RxCollection<Hazard>;
  implementationconstraint: RxCollection<ImplementationConstraint>;
  lossscenario: RxCollection<LossScenario>;
  loss: RxCollection<Loss>;
  project: RxCollection<Project>;
  responsibility: RxCollection<Responsibility>;
  rule: RxCollection<Rule>;
  subhazard: RxCollection<SubHazard>;
  subsystemconstraint: RxCollection<SubSystemConstraint>;
  systemconstraint: RxCollection<SystemConstraint>;
  systemdescription: RxCollection<SystemDescription>;
  unsafecontrolaction: RxCollection<UnsafeControlAction>;
};
