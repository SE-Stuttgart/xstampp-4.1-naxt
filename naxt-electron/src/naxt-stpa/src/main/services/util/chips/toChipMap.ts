import { Id, IdString } from '@src-shared/Interfaces';
import {
  Hazard,
  HazardLossLink,
  HazardSystemConstraintLink,
  Loss,
  ProcessModel,
  ProcessModelProcessVariableLink,
  ProcessVariable,
  ProcessVariableResponsibilityLink,
  Responsibility,
  ResponsibilitySubSystemConstraintLink,
  ResponsibilitySystemConstraintLink,
  SubHazard,
  SubSystemConstraint,
  SystemConstraint,
  UnsafeControlAction,
  UnsafeControlActionHazardLink,
  UnsafeControlActionSubHazardLink,
} from '@stpa/src/main/models';
import { Chip } from '@stpa/src/main/services/models/table-models/Chip';
import { ChipMap } from '@stpa/src/main/services/util/chips/ChipMap';
import {
  toHazardChips,
  toLossChips,
  toProcessModelChips,
  toResponsibilityChips,
  toSubHazardChips,
  toSubSystemConstraintChips,
  toSystemConstraintChips,
  toUnsafeControlActionChips,
} from '@stpa/src/main/services/util/chips/toChips';
import {
  toCombinedStringId,
  toHazardLinkId,
  toLossLinkId,
  toProcessModelLinkId,
  toProcessVariableLinkId,
  toResponsibilityLinkId,
  toSubHazardLinkId,
  toSubSystemConstraintLinkId,
  toSystemConstraintLinkId,
  toUnsafeControlActionLinkId,
} from '@stpa/src/main/services/util/chips/toCombinedIds';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function toLossChipMapByHazardId(
  losses$: Observable<Loss[]>,
  hazards$: Observable<Hazard[]>,
  links$: Observable<HazardLossLink[]>
): Observable<ChipMap> {
  return toChipMap$(toLossChips, toLossLinkId, toHazardLinkId, [losses$, hazards$, links$]);
}

export function toHazardChipMapByLossId(
  hazards$: Observable<Hazard[]>,
  losses$: Observable<Loss[]>,
  links$: Observable<HazardLossLink[]>
): Observable<ChipMap> {
  return toChipMap$(toHazardChips, toHazardLinkId, toLossLinkId, [hazards$, losses$, links$]);
}

export function toHazardChipMapBySystemConstraintId(
  hazards$: Observable<Hazard[]>,
  losses$: Observable<SystemConstraint[]>,
  links$: Observable<HazardSystemConstraintLink[]>
): Observable<ChipMap> {
  return toChipMap$(toHazardChips, toHazardLinkId, toSystemConstraintLinkId, [hazards$, losses$, links$]);
}

export function toSystemConstraintChipMapByHazardId(
  systemConstraints$: Observable<SystemConstraint[]>,
  hazards$: Observable<Hazard[]>,
  links$: Observable<HazardSystemConstraintLink[]>
): Observable<ChipMap> {
  return toChipMap$(toSystemConstraintChips, toSystemConstraintLinkId, toHazardLinkId, [
    systemConstraints$,
    hazards$,
    links$,
  ]);
}

export function toHazardChipMapByUnsafeControlActionId(
  hazards$: Observable<Hazard[]>,
  unsafeControlActions$: Observable<UnsafeControlAction[]>,
  links$: Observable<UnsafeControlActionHazardLink[]>
): Observable<ChipMap> {
  return toChipMap$(toHazardChips, toHazardLinkId, toUnsafeControlActionLinkId, [
    hazards$,
    unsafeControlActions$,
    links$,
  ]);
}

export function toUnsafeControlActionChipMapByHazardId(
  unsafeControlActions$: Observable<UnsafeControlAction[]>,
  hazards$: Observable<Hazard[]>,
  links$: Observable<UnsafeControlActionHazardLink[]>
): Observable<ChipMap> {
  return toChipMap$(toUnsafeControlActionChips, toUnsafeControlActionLinkId, toHazardLinkId, [
    unsafeControlActions$,
    hazards$,
    links$,
  ]);
}

export function toUnsafeControlActionChipMapBySubHazardId(
  unsafeControlActions$: Observable<UnsafeControlAction[]>,
  subHazards$: Observable<SubHazard[]>,
  links$: Observable<UnsafeControlActionSubHazardLink[]>
): Observable<ChipMap> {
  return toChipMap$(toUnsafeControlActionChips, toUnsafeControlActionLinkId, toSubHazardLinkId, [
    unsafeControlActions$,
    subHazards$,
    links$,
  ]);
}

export function toSubHazardChipMapByUnsafeControlActionId(
  subHazards$: Observable<SubHazard[]>,
  unsafeControlActions$: Observable<UnsafeControlAction[]>,
  links$: Observable<UnsafeControlActionSubHazardLink[]>
): Observable<ChipMap> {
  return toChipMap$(toSubHazardChips, toSubHazardLinkId, toUnsafeControlActionLinkId, [
    subHazards$,
    unsafeControlActions$,
    links$,
  ]);
}

export function toSystemConstraintChipMapByResponsibilityId(
  systemConstraints$: Observable<SystemConstraint[]>,
  responsibilities$: Observable<Responsibility[]>,
  links$: Observable<ResponsibilitySystemConstraintLink[]>
): Observable<ChipMap> {
  return toChipMap$(toSystemConstraintChips, toSystemConstraintLinkId, toResponsibilityLinkId, [
    systemConstraints$,
    responsibilities$,
    links$,
  ]);
}

export function toSubSystemConstraintChipMapByResponsibilityId(
  subSystemConstraints$: Observable<SubSystemConstraint[]>,
  Responsibilities$: Observable<Responsibility[]>,
  links$: Observable<ResponsibilitySubSystemConstraintLink[]>
): Observable<ChipMap> {
  return toChipMap$(toSubSystemConstraintChips, toSubSystemConstraintLinkId, toResponsibilityLinkId, [
    subSystemConstraints$,
    Responsibilities$,
    links$,
  ]);
}

export function toProcessModelChipMapByProcessVariableId(
  processModels$: Observable<ProcessModel[]>,
  processVariable$: Observable<ProcessVariable[]>,
  links$: Observable<ProcessModelProcessVariableLink[]>
): Observable<ChipMap> {
  return toChipMap$(toProcessModelChips, toProcessModelLinkId, toProcessVariableLinkId, [
    processModels$,
    processVariable$,
    links$,
  ]);
}

export function toResponsibilityChipMapByProcessVariableId$(
  Responsibilities$: Observable<Responsibility[]>,
  processVariable$: Observable<ProcessVariable[]>,
  links$: Observable<ProcessVariableResponsibilityLink[]>
): Observable<ChipMap> {
  return toChipMap$(toResponsibilityChips, toResponsibilityLinkId, toProcessVariableLinkId, [
    Responsibilities$,
    processVariable$,
    links$,
  ]);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function toChipMap$<T1 extends IdString | Id, T2 extends IdString | Id, L>(
  toChips: (T1, L) => Chip[],
  toChipId: (L) => string,
  toMapById: (L) => string,
  observables: [Observable<T1[]>, Observable<T2[]>, Observable<L[]>]
): Observable<ChipMap> {
  return combineLatest(observables).pipe(map(toChipMap(toChips, toChipId, toMapById)));
}

function toChipMap(toChips: (T1, L) => Chip[], toChipId: (L) => string, toMapById: (L) => string) {
  return function <T1 extends IdString | Id, T2 extends IdString | Id, L>([modelsToChips, mappedBy, links]: [
    T1[],
    T2[],
    L[]
  ]) {
    const chipMap = new ChipMap();
    mappedBy.forEach(element => {
      const combinedElementId = toCombinedStringId(element);

      chipMap.set(
        combinedElementId,
        toChips(modelsToChips, links.filter(link => toMapById(link) === combinedElementId).map(toChipId))
      );
    });
    return chipMap;
  };
}
