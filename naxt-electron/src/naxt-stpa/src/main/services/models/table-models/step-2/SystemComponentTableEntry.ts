import { Actuator, ControlledProcess, Controller, Sensor } from '@src-shared/control-structure/models';
import { State, SystemComponentType } from '@src-shared/Enums';
import { ChipPrefix } from '@stpa/src/main/services/models/table-models/Chip';
import { ProjectDependentTableEntry } from '@stpa/src/main/services/models/table-models/common/ProjectDependentTableEntry';

export type SystemComponent = Actuator & ControlledProcess & Controller & Sensor;

export class SystemComponentTableEntry extends ProjectDependentTableEntry implements SystemComponent {
  readonly tableId: string;
  readonly type: SystemComponentType;

  readonly id: number;
  readonly projectId: string;

  name: string;
  description: string;
  state: State;

  readonly boxId: string;

  constructor(systemComponent: SystemComponent, systemComponentType: SystemComponentType) {
    super(systemComponent);
    this.boxId = systemComponent.boxId;
    this.type = systemComponentType;
  }
}

export class ActuatorTableEntry extends SystemComponentTableEntry {
  readonly tableId: string;
  constructor(actuator: Actuator) {
    super(actuator, SystemComponentType.Actuator);
    this.tableId = ChipPrefix.Actuator + this.tableId;
  }
}

export class ControlledProcessTableEntry extends SystemComponentTableEntry {
  readonly tableId: string;
  constructor(controlledProcess: ControlledProcess) {
    super(controlledProcess, SystemComponentType.ControlledProcess);
    this.tableId = ChipPrefix.ControlledProcess + this.tableId;
  }
}

export class ControllerTableEntry extends SystemComponentTableEntry {
  readonly tableId: string;
  constructor(controller: Controller) {
    super(controller, SystemComponentType.Controller);
    this.tableId = ChipPrefix.Controller + this.tableId;
  }
}

export class SensorTableEntry extends SystemComponentTableEntry {
  readonly tableId: string;
  constructor(sensor: Sensor) {
    super(sensor, SystemComponentType.Sensor);
    this.tableId = ChipPrefix.Sensor + this.tableId;
  }
}
