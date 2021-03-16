import * as _ from '@stpa/src/main/controllers';
import { Container } from 'inversify';
import 'reflect-metadata';

export const container = new Container({ autoBindInjectable: true });

export * from '@stpa/src/main/models';
export * from '@stpa/src/main/services/models';

// ./presenters/step-1
export const hazardController = container.get(_.HazardController);
export const lossController = container.get(_.LossController);
export const subHazardController = container.get(_.SubHazardController);
export const subSystemConstraintController = container.get(_.SubSystemConstraintController);
export const systemConstraintController = container.get(_.SystemConstraintController);

// ./presenters/step-2
export const controlStructureController = container.get(_.ControlStructureController);
export const informationFlowController = container.get(_.InformationFlowController);
export const responsibilityController = container.get(_.ResponsibilityController);
export const systemComponentController = container.get(_.SystemComponentController);

// ./presenters/step-3
export const controllerConstraintController = container.get(_.ControllerConstraintController);
export const unsafeControlActionController = container.get(_.UnsafeControlActionController);

// ./presenters/step-4
export const processModelController = container.get(_.ProcessModelController);
export const processVariableController = container.get(_.ProcessVariableController);
export const controlAlgorithmController = container.get(_.ControlAlgorithmController);
export const conversionController = container.get(_.ConversionController);
export const lossScenarioController = container.get(_.LossScenarioController);
export const implementationConstraintController = container.get(_.ImplementationConstraintController);

// ./presenters
export const projectController = container.get(_.ProjectController);
export const systemDescriptionController = container.get(_.SystemDescriptionController);
export const importExportController = container.get(_.ImportExportController);
