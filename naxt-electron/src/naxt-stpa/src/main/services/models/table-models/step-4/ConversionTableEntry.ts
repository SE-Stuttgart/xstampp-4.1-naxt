import { State } from '@src-shared/Enums';
import { TableEntry } from '@src-shared/Interfaces';
import { Chip, ChipPrefix } from '@stpa/src/main/services/models/table-models/Chip';
import { Conversion, ConversionSensor } from '../../../../models';

export enum ConversionType {
  Actuator = 'Actuator',
  Sensor = 'Sensor',
}

export class ConversionTableEntry implements TableEntry {
  readonly tableId: string;
  readonly id: number = -1;
  readonly parentId: number = -1;
  readonly projectId: string = '';

  readonly type: ConversionType;

  conversion: string = '';
  controlActionId: number = -1;

  readonly name: string;
  readonly description: string;
  state: State = State.TODO;

  readonly parentChips: Chip[];
  readonly controlActionChips: Chip[];

  parentComponentName?: string;

  constructor(
    conversion: Conversion | ConversionSensor,
    conversionType: ConversionType,
    parentChips: Chip[],
    controlActionChips: Chip[]
  ) {
    if (conversionType === ConversionType.Actuator)
      this.tableId = `${ChipPrefix.ConversionActuator}${conversion.parentId}.${conversion.id}`;
    else this.tableId = `${ChipPrefix.ConversionSensor}${conversion.parentId}.${conversion.id}`;

    this.id = conversion.id;
    this.parentId = conversion.parentId;
    this.projectId = conversion.projectId;

    this.conversion = conversion.conversion;
    this.controlActionId = conversion.controlActionId;

    this.name = conversion.name;
    this.description = conversion.description;
    this.state = conversion.state;

    this.type = conversionType;

    this.parentChips = parentChips;
    this.controlActionChips = controlActionChips;

    this.parentComponentName = this.parentChips[0]?.name ?? '';
  }
}
