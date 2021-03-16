import {
  AccidentDescription,
  ChangesAndDynamicsOverTime,
  ChangesAndDynamicsOverTimeControllerLink,
  ChangesAndDynamicsOverTimeDescription,
  CommunicationAndCoordination,
  CommunicationAndCoordinationController1Link,
  CommunicationAndCoordinationController2Link,
  CommunicationAndCoordinationDescription,
  Constraint,
  ConstraintHazardLink,
  ConstraintResponsibilityLink,
  ControllerResponsibilityLink,
  Event,
  Hazard,
  InternalAndExternalEconomics,
  InternalAndExternalEconomicsControllerLink,
  InternalAndExternalEconomicsDescription,
  LastIdEntry,
  OtherFactors,
  ProcessVariable,
  QuestionAndAnswer,
  QuestionComponentLink,
  Recommendation,
  Responsibility,
  RoleInTheAccident,
  SafetyCulture,
  SafetyCultureControllerLink,
  SafetyCultureDescription,
  SafetyInformationSystem,
  SafetyInformationSystemControllerLink,
  SafetyInformationSystemDescription,
  SafetyManagementSystem,
  SafetyManagementSystemControllerLink,
  SafetyManagementSystemDescription,
  SubRecommendation,
  SystemDescription,
} from '@cast/src/main/models';
import { lastIdEntrySchema } from '@database-access/cast/schemas/LastIdSchema';
import { constraintHazardLinkSchema } from '@database-access/cast/schemas/links/ConstraintHazardLinkSchema';
import { constraintResponsibilityLinkSchema } from '@database-access/cast/schemas/links/ConstraintResponsibilityLinkSchema';
import { changesAndDynamicsOverTimeControllerLinkSchema } from '@database-access/cast/schemas/links/controller-link-schemas/ChangesAndDynamicsOverTimeControllerLinkSchema';
import {
  communicationAndCoordinationController1LinkSchema,
  communicationAndCoordinationController2LinkSchema,
} from '@database-access/cast/schemas/links/controller-link-schemas/CommunicationAndCoordinationControllerLinkSchema';
import { internalAndExternalEconomicsControllerLinkSchema } from '@database-access/cast/schemas/links/controller-link-schemas/InternalAndExternalEconomicsControllerLinkSchema';
import { safetyCultureControllerLinkSchema } from '@database-access/cast/schemas/links/controller-link-schemas/SafetyCultureControllerLinkSchema';
import { safetyInformationSystemControllerLinkSchema } from '@database-access/cast/schemas/links/controller-link-schemas/SafetyInformationSystemControllerLinkSchema';
import { safetyManagementSystemControllerLinkSchema } from '@database-access/cast/schemas/links/controller-link-schemas/SafetyManagementSystemControllerLinkSchema';
import { controllerResponsibilitySchemaLink } from '@database-access/cast/schemas/links/ControllerResponsibilitySchemaLink';
import { questionComponentLinkSchema } from '@database-access/cast/schemas/links/QuestionComponentLinkSchema';
import { questionAndAnswersSchema } from '@database-access/cast/schemas/QuestionAndAnswersSchema';
import { accidentDescriptionSchema } from '@database-access/cast/schemas/step-1/AccidentDescriptionSchema';
import { constraintSchema } from '@database-access/cast/schemas/step-1/ConstraintSchema';
import { eventSchema } from '@database-access/cast/schemas/step-1/EventSchema';
import { hazardSchema } from '@database-access/cast/schemas/step-1/HazardSchema';
import { systemDescriptionSchema } from '@database-access/cast/schemas/step-1/SystemDescriptionSchema';
import { processVariableSchema } from '@database-access/cast/schemas/step-2/ProcessVariableSchema';
import { responsibilitySchema } from '@database-access/cast/schemas/step-2/ResponsibilitySchema';
import { roleInTheAccidentSchema } from '@database-access/cast/schemas/step-3/RoleInTheAccidentSchema';
import { changesAndDynamicsOverTimeSchema } from '@database-access/cast/schemas/step-4/ChangesAndDynamicsOverTimeSchema';
import { communicationAndCoordinationSchema } from '@database-access/cast/schemas/step-4/CommunicationAndCoordinationSchema';
import { changesAndDynamicsOverTimeDescriptionSchema } from '@database-access/cast/schemas/step-4/descriptions/ChangesAndDynamicsOverTimeDescriptionSchema';
import { communicationAndCoordinationDescriptionSchema } from '@database-access/cast/schemas/step-4/descriptions/CommunicationAndCoordinationDescriptionSchema';
import { internalAndExternalEconomicsDescriptionSchema } from '@database-access/cast/schemas/step-4/descriptions/InternalAndExternalEconomicsDescriptionSchema';
import { safetyCultureDescriptionSchema } from '@database-access/cast/schemas/step-4/descriptions/SafetyCultureDescriptionSchema';
import { safetyInformationSystemDescriptionSchema } from '@database-access/cast/schemas/step-4/descriptions/SafetyInformationSystemDescriptionSchema';
import { safetyManagementSystemDescriptionSchema } from '@database-access/cast/schemas/step-4/descriptions/SafetyManagementSystemDescriptionSchema';
import { internalAndExternalEconomicsSchema } from '@database-access/cast/schemas/step-4/InternalAndExternalEconomicsSchema';
import { otherFactorsSchema } from '@database-access/cast/schemas/step-4/OtherFactorsSchema';
import { safetyCultureSchema } from '@database-access/cast/schemas/step-4/SafetyCultureSchema';
import { safetyInformationSystemSchema } from '@database-access/cast/schemas/step-4/SafetyInformationSystemSchema';
import { safetyManagementSystemSchema } from '@database-access/cast/schemas/step-4/SafetyManagementSystemSchema';
import { recommendationSchema } from '@database-access/cast/schemas/step-5/RecommendationSchema';
import { subRecommendationSchema } from '@database-access/cast/schemas/step-5/SubRecommendationSchema';
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
import { RxCollection } from 'rxdb';

export type CastDatabaseCollections = {
  project: RxCollection<Project>;
  questionAndAnswers: RxCollection<QuestionAndAnswer>;
  lastIdEntry: RxCollection<LastIdEntry>;

  // step 1
  systemDescription: RxCollection<SystemDescription>;
  accidentDescription: RxCollection<AccidentDescription>;
  constraint: RxCollection<Constraint>;
  hazard: RxCollection<Hazard>;
  event: RxCollection<Event>;

  // step 2
  arrow: RxCollection<Arrow>;
  box: RxCollection<Box>;

  actuator: RxCollection<Actuator>;
  controller: RxCollection<Controller>;
  processVariable: RxCollection<ProcessVariable>;
  controlledprocess: RxCollection<ControlledProcess>;
  sensor: RxCollection<Sensor>;

  controlaction: RxCollection<ControlAction>;
  feedback: RxCollection<Feedback>;
  input: RxCollection<Input>;
  output: RxCollection<Output>;

  responsibility: RxCollection<Responsibility>;

  // step 3
  roleInTheAccident: RxCollection<RoleInTheAccident>;

  // step 4
  changesAndDynamicsOverTime: RxCollection<ChangesAndDynamicsOverTime>;
  communicationAndCoordination: RxCollection<CommunicationAndCoordination>;
  internalAndExternalEconomics: RxCollection<InternalAndExternalEconomics>;
  otherFactors: RxCollection<OtherFactors>;
  safetyCulture: RxCollection<SafetyCulture>;
  safetyInformationSystem: RxCollection<SafetyInformationSystem>;
  safetyManagementSystem: RxCollection<SafetyManagementSystem>;

  changesAndDynamicsOverTimeDescription: RxCollection<ChangesAndDynamicsOverTimeDescription>;
  communicationAndCoordinationDescription: RxCollection<CommunicationAndCoordinationDescription>;
  internalAndExternalEconomicsDescription: RxCollection<InternalAndExternalEconomicsDescription>;
  safetyCultureDescription: RxCollection<SafetyCultureDescription>;
  safetyInformationSystemDescription: RxCollection<SafetyInformationSystemDescription>;
  safetyManagementSystemDescription: RxCollection<SafetyManagementSystemDescription>;

  // step 5
  recommendation: RxCollection<Recommendation>;
  subRecommendation: RxCollection<SubRecommendation>;

  // links
  constraintHazardLink: RxCollection<ConstraintHazardLink>;
  constraintResponsibilityLink: RxCollection<ConstraintResponsibilityLink>;
  controllerResponsibilityLink: RxCollection<ControllerResponsibilityLink>;
  changesAndDynamicsOverTimeControllerLink: RxCollection<ChangesAndDynamicsOverTimeControllerLink>;
  communicationAndCoordinationControllerLink: RxCollection<CommunicationAndCoordinationController1Link>;
  internalAndExternalEconomicsControllerLink: RxCollection<InternalAndExternalEconomicsControllerLink>;
  safetyCultureControllerLink: RxCollection<SafetyCultureControllerLink>;
  safetyInformationSystemControllerLink: RxCollection<SafetyInformationSystemControllerLink>;
  safetyManagementSystemControllerLink: RxCollection<SafetyManagementSystemControllerLink>;
};

export const castCollections = [
  {
    name: QuestionAndAnswer.name.toLowerCase(),
    schema: questionAndAnswersSchema,
  },
  {
    name: LastIdEntry.name.toLowerCase(),
    schema: lastIdEntrySchema,
  },

  // step 1
  {
    name: SystemDescription.name.toLocaleLowerCase(),
    schema: systemDescriptionSchema,
  },

  {
    name: AccidentDescription.name.toLowerCase(),
    schema: accidentDescriptionSchema,
  },
  {
    name: Constraint.name.toLowerCase(),
    schema: constraintSchema,
  },
  {
    name: Event.name.toLowerCase(),
    schema: eventSchema,
  },
  {
    name: Hazard.name.toLowerCase(),
    schema: hazardSchema,
  },

  // step 2
  {
    name: ProcessVariable.name.toLowerCase(),
    schema: processVariableSchema,
  },
  {
    name: Responsibility.name.toLowerCase(),
    schema: responsibilitySchema,
  },

  // step 3

  {
    name: RoleInTheAccident.name.toLowerCase(),
    schema: roleInTheAccidentSchema,
  },

  // step 4

  {
    name: ChangesAndDynamicsOverTime.name.toLowerCase(),
    schema: changesAndDynamicsOverTimeSchema,
  },
  {
    name: CommunicationAndCoordination.name.toLowerCase(),
    schema: communicationAndCoordinationSchema,
  },
  {
    name: InternalAndExternalEconomics.name.toLowerCase(),
    schema: internalAndExternalEconomicsSchema,
  },
  {
    name: SafetyCulture.name.toLowerCase(),
    schema: safetyCultureSchema,
  },
  {
    name: SafetyInformationSystem.name.toLowerCase(),
    schema: safetyInformationSystemSchema,
  },
  {
    name: SafetyManagementSystem.name.toLowerCase(),
    schema: safetyManagementSystemSchema,
  },
  {
    name: OtherFactors.name.toLowerCase(),
    schema: otherFactorsSchema,
  },

  {
    name: ChangesAndDynamicsOverTimeDescription.name.toLowerCase(),
    schema: changesAndDynamicsOverTimeDescriptionSchema,
  },
  {
    name: CommunicationAndCoordinationDescription.name.toLowerCase(),
    schema: communicationAndCoordinationDescriptionSchema,
  },
  {
    name: InternalAndExternalEconomicsDescription.name.toLowerCase(),
    schema: internalAndExternalEconomicsDescriptionSchema,
  },
  {
    name: SafetyCultureDescription.name.toLowerCase(),
    schema: safetyCultureDescriptionSchema,
  },
  {
    name: SafetyInformationSystemDescription.name.toLowerCase(),
    schema: safetyInformationSystemDescriptionSchema,
  },
  {
    name: SafetyManagementSystemDescription.name.toLowerCase(),
    schema: safetyManagementSystemDescriptionSchema,
  },
  {
    name: OtherFactors.name.toLowerCase(),
    schema: otherFactorsSchema,
  },

  // step 5

  {
    name: Recommendation.name.toLowerCase(),
    schema: recommendationSchema,
  },
  {
    name: SubRecommendation.name.toLowerCase(),
    schema: subRecommendationSchema,
  },

  // links

  {
    name: ConstraintHazardLink.name.toLowerCase(),
    schema: constraintHazardLinkSchema,
  },
  {
    name: ConstraintResponsibilityLink.name.toLowerCase(),
    schema: constraintResponsibilityLinkSchema,
  },
  {
    name: ControllerResponsibilityLink.name.toLowerCase(),
    schema: controllerResponsibilitySchemaLink,
  },
  {
    name: ChangesAndDynamicsOverTimeControllerLink.name.toLowerCase(),
    schema: changesAndDynamicsOverTimeControllerLinkSchema,
  },
  {
    name: CommunicationAndCoordinationController1Link.name.toLowerCase(),
    schema: communicationAndCoordinationController1LinkSchema,
  },
  {
    name: CommunicationAndCoordinationController2Link.name.toLowerCase(),
    schema: communicationAndCoordinationController2LinkSchema,
  },
  {
    name: InternalAndExternalEconomicsControllerLink.name.toLowerCase(),
    schema: internalAndExternalEconomicsControllerLinkSchema,
  },
  {
    name: SafetyCultureControllerLink.name.toLowerCase(),
    schema: safetyCultureControllerLinkSchema,
  },
  {
    name: SafetyInformationSystemControllerLink.name.toLowerCase(),
    schema: safetyInformationSystemControllerLinkSchema,
  },
  {
    name: SafetyManagementSystemControllerLink.name.toLowerCase(),
    schema: safetyManagementSystemControllerLinkSchema,
  },
  {
    name: QuestionComponentLink.name.toLowerCase(),
    schema: questionComponentLinkSchema,
  },
];
