import { Controller } from '@src-shared/control-structure/models';
import { State } from '@src-shared/Enums';
import { ProcessVariable, VariableType } from '@stpa/src/main/models';
import { Chip, ChipPrefix } from '@stpa/src/main/services/models/table-models/Chip';
import { ProjectDependentTableEntry } from '../common/ProjectDependentTableEntry';

export class ProcessVariableTableEntry extends ProjectDependentTableEntry implements ProcessVariable {
  readonly id: number;
  readonly projectId: string;
  readonly tableId: string;

  name: string;
  description: string;
  state: State;

  arrowId: string;
  readonly controller: Controller;

  variable_type: VariableType;
  currentVariableValue: string;
  possibleVariableValues: string[];

  nuSMVName: string;
  spinName: string;

  readonly processModelChips: Chip[];
  readonly responsibilityChips: Chip[];
  readonly inputChips: Chip[];

  constructor(
    processVariable: ProcessVariable,
    controller: Controller,
    currentVariableValue: string,
    possibleVariableValues: string[],
    processModelChips: Chip[],
    responsibilityChips: Chip[],
    inputChips: Chip[]
  ) {
    super(processVariable);
    this.tableId = ChipPrefix.ProcessVariable + this.tableId;
    this.arrowId = processVariable.arrowId;
    this.controller = controller;

    this.variable_type = processVariable.variable_type;
    this.currentVariableValue = currentVariableValue;
    this.possibleVariableValues = possibleVariableValues;

    this.nuSMVName = processVariable.nuSMVName;
    this.spinName = processVariable.spinName;

    this.processModelChips = processModelChips;
    this.responsibilityChips = responsibilityChips;
    this.inputChips = inputChips;
  }
}
