import { Chip, ChipPrefix } from '@cast/src/main/services/models';
import { Id, IdString, Label, Named } from '@src-shared/Interfaces';

export const toControlActionChips = toChips(ChipPrefix.ControlAction);
export const toFeedbackChips = toChips(ChipPrefix.Feedback);
export const toInputChips = toChips(ChipPrefix.Input);
export const toOutputChips = toChips(ChipPrefix.Output);
export const toActuatorChips = toChips(ChipPrefix.Actuator);
export const toControlledProcessChips = toChips(ChipPrefix.ControlledProcess);
export const toControllerChips = toChips(ChipPrefix.Controller);
export const toSensorChips = toChips(ChipPrefix.Sensor);
export const toRecommendationChips = toChips(ChipPrefix.Recommendation);
export const toSubRecommendationChips = toChips(ChipPrefix.SubRecommendation);

export function toChips(labelPrefix: ChipPrefix) {
  return function (entities: ((IdString | Id) & Named)[], linkedIds: (string | number)[]): Chip[] {
    linkedIds = linkedIds.map(id => id.toString());
    const selected: Chip[] = entities.filter(entity => linkedIds.includes(entity.id.toString())).map(toChip(true));
    const notSelected: Chip[] = entities.filter(entity => !linkedIds.includes(entity.id.toString())).map(toChip(false));

    return selected.concat(notSelected).sort((chip1, chip2) => {
      if (chip1.label.length < chip2.label.length) return -1;
      if (chip1.label.length > chip2.label.length) return 1;
      if (chip1.label < chip2.label) return -1;
      if (chip1.label === chip2.label) return 0;
      return 1;
    });

    function toChip(selected: boolean) {
      return function (entity: IdString & Named & Label): Chip {
        const { id, name, label } = entity;
        const chipLabel = labelPrefix + (label ?? id);
        return { id: id, label: chipLabel, name: name, selected: selected };
      };
    }
  };
}
