import { State } from '@src-shared/Enums';
import { ProcessModel } from '@stpa/src/main/models';
import { ProjectDependentTableEntry } from '@stpa/src/main/services/models/table-models/common/ProjectDependentTableEntry';
import { Chip, ChipPrefix } from '../Chip';

export class ProcessModelTableEntry extends ProjectDependentTableEntry implements ProcessModel {
  readonly id: number;
  readonly projectId: string;
  readonly tableId: string;

  name: string;
  description: string;
  state: State;

  controllerId: number;

  readonly controllerChips: Chip[];

  constructor(processModel: ProcessModel, controllerChips: Chip[]) {
    super(processModel);
    this.tableId = ChipPrefix.ProcessModel + this.tableId;
    this.controllerId = processModel.controllerId;
    this.controllerChips = controllerChips;
  }
}
