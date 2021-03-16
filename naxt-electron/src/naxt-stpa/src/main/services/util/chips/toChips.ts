import { Id, Named, ParentId } from '@src-shared/Interfaces';
import { toCombinedStringId } from '@stpa/src/main/services/util/chips/toCombinedIds';
import { Chip, ChipPrefix } from '../../models/table-models/Chip';

export const toHazardChips = toChips(ChipPrefix.Hazard);
export const toSubHazardChips = toChips(ChipPrefix.SubHazard);
export const toLossChips = toChips(ChipPrefix.Loss);
export const toSystemConstraintChips = toChips(ChipPrefix.SystemConstraint);
export const toSubSystemConstraintChips = toChips(ChipPrefix.SubSystemConstraint);
export const toControlActionChips = toChips(ChipPrefix.ControlAction);
export const toSensorChips = toChips(ChipPrefix.Sensor);
export const toActuatorChips = toChips(ChipPrefix.Actuator);
export const toUnsafeControlActionChips = toChips(ChipPrefix.UnsafeControlAction);
export const toControllerChips = toChips(ChipPrefix.Controller);
export const toResponsibilityChips = toChips(ChipPrefix.Responsibility);
export const toProcessModelChips = toChips(ChipPrefix.ProcessModel);
export const toControllerConstraintChips = toChips(ChipPrefix.ControllerConstraint);

function toChips(labelPrefix: ChipPrefix) {
  return function (entities: ((Id | (Id & ParentId)) & Named)[], linkedIds: string[]): Chip[] {
    const selected: Chip[] = getSelected();
    const notSelected: Chip[] = getUnselected();
    return selected.concat(notSelected).sort((chip1, chip2) => {
      if (chip1.label.length < chip2.label.length) return -1;
      if (chip1.label.length > chip2.label.length) return 1;
      if (chip1.label === chip2.label) return 0;
      if (chip1.label < chip2.label) return -1;
      return 1;
    });

    function getSelected(): Chip[] {
      return entities.filter(entity => linkedIds.includes(toCombinedStringId(entity))).map(toChip(true));
    }

    function getUnselected(): Chip[] {
      return entities.filter(entity => !linkedIds.includes(toCombinedStringId(entity))).map(toChip(false));
    }

    function toChip(selected: boolean) {
      return function (entity: (Id | (Id & ParentId)) & Named): Chip {
        const { id, name } = entity;
        const parentId = entity.hasOwnProperty('parentId') ? (entity as any).parentId : undefined;
        const label = parentId ? `${labelPrefix}${parentId}.${id}` : `${labelPrefix}${id}`;

        return { id: id, parentId: parentId, label: label, name: name, selected: selected };
      };
    }
  };
}
