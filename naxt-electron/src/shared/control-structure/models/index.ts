import { Arrow } from '@src-shared/control-structure/models/Arrow';
import { Box } from '@src-shared/control-structure/models/Box';
import { ControlStructure } from '@src-shared/control-structure/models/ControlStructure';
import { VectorGraphic } from '@src-shared/control-structure/models/VectorGraphic';

import { ControlAction } from '@src-shared/control-structure/models/information-flow/ControlAction';
import { Feedback } from '@src-shared/control-structure/models/information-flow/Feedback';
import { Input } from '@src-shared/control-structure/models/information-flow/Input';
import { Output } from '@src-shared/control-structure/models/information-flow/Output';

import { Actuator } from '@src-shared/control-structure/models/system-components/Actuator';
import { ControlledProcess } from '@src-shared/control-structure/models/system-components/ControlledProcess';
import { Controller } from '@src-shared/control-structure/models/system-components/Controller';
import { Sensor } from '@src-shared/control-structure/models/system-components/Sensor';

export {
  Arrow,
  Box,
  ControlStructure,
  ControlAction,
  Feedback,
  Input,
  Output,
  Actuator,
  ControlledProcess,
  Controller,
  Sensor,
  VectorGraphic,
};

export interface ControlStructureProject {
  arrows: Arrow[];
  boxes: Box[];
  controlActions: ControlAction[];
  feedback: Feedback[];
  inputs: Input[];
  outputs: Output[];
  actuators: Actuator[];
  controlledProcesses: ControlledProcess[];
  controllers: Controller[];
  sensors: Sensor[];
  vectorGraphic: VectorGraphic;
}
