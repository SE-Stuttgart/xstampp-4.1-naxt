import { arrowSchema } from '@database-access/shared/schemas/control-structure/ArrowSchema';
import { boxSchema } from '@database-access/shared/schemas/control-structure/BoxSchema';
import { controlActionSchema } from '@database-access/shared/schemas/control-structure/information-flow/ControlActionSchema';
import { feedbackSchema } from '@database-access/shared/schemas/control-structure/information-flow/FeedbackSchema';
import { inputSchema } from '@database-access/shared/schemas/control-structure/information-flow/InputSchema';
import { outputSchema } from '@database-access/shared/schemas/control-structure/information-flow/OutputSchema';
import { actuatorSchema } from '@database-access/shared/schemas/control-structure/system-components/ActuatorSchema';
import { controlledProcessSchema } from '@database-access/shared/schemas/control-structure/system-components/ControlledProcessSchema';
import { controllerSchema } from '@database-access/shared/schemas/control-structure/system-components/ControllerSchema';
import { sensorSchema } from '@database-access/shared/schemas/control-structure/system-components/SensorSchema';
import { vectorGraphicSchema } from '@database-access/shared/schemas/control-structure/VectorGraphicSchema';
import { projectSchema } from '@database-access/shared/schemas/ProjectSchema';
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
  VectorGraphic,
} from '@src-shared/control-structure/models';
import { Project } from '@src-shared/project/Project';

const projectCollections = [
  {
    name: Project.name.toLowerCase(),
    schema: projectSchema,
  },
];

const controlStructureCollections = [
  {
    name: Arrow.name.toLowerCase(),
    schema: arrowSchema,
  },
  {
    name: Box.name.toLowerCase(),
    schema: boxSchema,
  },
  {
    name: Actuator.name.toLowerCase(),
    schema: actuatorSchema,
  },
  {
    name: ControlAction.name.toLowerCase(),
    schema: controlActionSchema,
  },
  {
    name: ControlledProcess.name.toLowerCase(),
    schema: controlledProcessSchema,
  },
  {
    name: Controller.name.toLowerCase(),
    schema: controllerSchema,
  },
  {
    name: Feedback.name.toLowerCase(),
    schema: feedbackSchema,
  },
  {
    name: Input.name.toLowerCase(),
    schema: inputSchema,
  },
  {
    name: Output.name.toLowerCase(),
    schema: outputSchema,
  },
  {
    name: Sensor.name.toLowerCase(),
    schema: sensorSchema,
  },
  {
    name: VectorGraphic.name.toLowerCase(),
    schema: vectorGraphicSchema,
  },
];

export const sharedCollections = [].concat(projectCollections, controlStructureCollections);
