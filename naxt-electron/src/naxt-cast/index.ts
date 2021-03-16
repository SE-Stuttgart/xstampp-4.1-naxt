import * as _ from '@cast/src/main/controllers';
import { Container } from 'inversify';
import 'reflect-metadata';

const container = new Container({ autoBindInjectable: true });

export * from '@cast/src/main/services/models';
export * from '@cast/src/main/models';

export const projectController = container.get(_.ProjectController);
export const questionAndAnswerController = container.get(_.QuestionAndAnswerController);
export const importExportController = container.get(_.ImportExportController);

// ./controllers/step-one
export const systemDescriptionController = container.get(_.SystemDescriptionController);
export const accidentDescriptionController = container.get(_.AccidentDescriptionController);
export const hazardController = container.get(_.HazardController);
export const constraintController = container.get(_.ConstraintController);
export const eventController = container.get(_.EventController);

// ./controllers/step-two
export const controlStructureController = container.get(_.ControlStructureController);
export const informationFlowController = container.get(_.InformationFlowController);
export const responsibilityController = container.get(_.ResponsibilityController);
export const systemComponentController = container.get(_.SystemComponentController);

// ./controllers/step-three
export const roleInTheAccidentController = container.get(_.RoleInTheAccidentController);

// ./controllers/step-four
export const changesAndDynamicsOverTimeController = container.get(_.ChangesAndDynamicsOverTimeController);
export const communicationAndCoordinationController = container.get(_.CommunicationAndCoordinationController);
export const internalAndExternalEconomicsController = container.get(_.InternalAndExternalEconomicsController);
export const otherFactorsController = container.get(_.OtherFactorsController);
export const safetyCultureController = container.get(_.SafetyCultureController);
export const safetyInformationSystemController = container.get(_.SafetyInformationSystemController);
export const safetyManagementSystemController = container.get(_.SafetyManagementSystemController);

// ./controllers/step-four
export const recommendationsController = container.get(_.RecommendationsController);
export const subRecommendationController = container.get(_.SubRecommendationController);
