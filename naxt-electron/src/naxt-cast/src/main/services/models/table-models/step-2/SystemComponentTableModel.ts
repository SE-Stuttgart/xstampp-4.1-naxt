import { ChipPrefix } from '@cast/src/main/services/models/Chip';
import { Actuator, ControlledProcess, Controller, Sensor } from '@src-shared/control-structure/models';
import { State, SystemComponentType } from '@src-shared/Enums';
import { TableId } from '@src-shared/Interfaces';
import { ProcessVariable } from '../../../../models';

export type SystemComponent = Actuator & ControlledProcess & Controller & Sensor;
export class SystemComponentTableModel implements SystemComponent, TableId {
  readonly type: SystemComponentType;

  readonly id: number;
  readonly tableId: string;
  readonly projectId: string;

  name: string;
  description: string;
  state: State;

  readonly boxId: string;

  constructor(systemComponent: SystemComponent, systemComponentType: SystemComponentType) {
    this.id = systemComponent.id;
    this.projectId = systemComponent.projectId;

    this.name = systemComponent.name;
    this.description = systemComponent.description;
    this.state = systemComponent.state;

    this.type = systemComponentType;
    this.boxId = systemComponent.boxId;
  }
}

export class ActuatorTableModel extends SystemComponentTableModel {
  readonly tableId: string;
  constructor(systemComponent: SystemComponent) {
    super(systemComponent, SystemComponentType.Actuator);
    this.tableId = ChipPrefix.Actuator + this.id;
  }
}

export class ControlledProcessTableModel extends SystemComponentTableModel {
  readonly tableId: string;
  constructor(controlledProcess: ControlledProcess) {
    super(controlledProcess, SystemComponentType.ControlledProcess);
    this.tableId = ChipPrefix.ControlledProcess + this.id;
  }
}

export class ControllerTableModel extends SystemComponentTableModel {
  readonly processVariables = new Array<ProcessVariable>();
  readonly tableId: string;
  constructor(systemComponent: SystemComponent, processVariables: ProcessVariable[]) {
    super(systemComponent, SystemComponentType.Controller);
    this.tableId = ChipPrefix.Controller + this.id;
    this.processVariables = processVariables;
  }
}

export class SensorTableModel extends SystemComponentTableModel {
  readonly tableId: string;
  constructor(sensor: Sensor) {
    super(sensor, SystemComponentType.Sensor);
    this.tableId = ChipPrefix.Sensor + this.id;
  }
}
