import { Chip, ChipPrefix } from '@cast/src/main/services/models/Chip';
import { InformationFlowTableModel } from '@cast/src/main/services/models/table-models/step-2/InformationFlowTableModel';
import { SystemComponentTableModel } from '@cast/src/main/services/models/table-models/step-2/SystemComponentTableModel';
import { InformationFlowType, State, SystemComponentType } from '@src-shared/Enums';
import { RoleInTheAccident } from '../../../../models';
import { TableModel } from '../common/TableModel';

export class RoleInTheAccidentTableModel extends TableModel implements RoleInTheAccident {
  id: string;
  projectId: string;
  tableId: string;
  label: string;

  name: string;
  state: State;

  currentValue: string;
  explanation: string;
  flawProcessVariable: string;
  description: string;
  rule: string;

  readonly componentChips: Chip[];
  readonly componentId: number;
  readonly componentType: SystemComponentType | InformationFlowType;
  readonly component: SystemComponentTableModel | InformationFlowTableModel;

  get controllerName(): string {
    return this.component.name ?? '';
  }
  constructor(
    roleInTheAccident: RoleInTheAccident,
    component: SystemComponentTableModel | InformationFlowTableModel,
    componentChips: Chip[]
  ) {
    super(ChipPrefix.RoleInTheAccident, roleInTheAccident);

    this.name = roleInTheAccident.name;
    this.state = roleInTheAccident.state;
    this.currentValue = roleInTheAccident.currentValue;
    this.explanation = roleInTheAccident.explanation;
    this.flawProcessVariable = roleInTheAccident.flawProcessVariable;
    this.description = roleInTheAccident.description;
    this.rule = roleInTheAccident.rule;

    this.componentId = roleInTheAccident.componentId;
    this.componentType = roleInTheAccident.componentType;
    this.component = component;
    this.componentChips = componentChips;
  }
}
