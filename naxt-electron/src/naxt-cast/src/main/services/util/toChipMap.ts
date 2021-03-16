import {
  ChangesAndDynamicsOverTime,
  ChangesAndDynamicsOverTimeControllerLink,
  CommunicationAndCoordination,
  CommunicationAndCoordinationController1Link,
  Constraint,
  ConstraintHazardLink,
  ConstraintResponsibilityLink,
  ControllerResponsibilityLink,
  Hazard,
  InternalAndExternalEconomics,
  InternalAndExternalEconomicsControllerLink,
  Responsibility,
  SafetyCulture,
  SafetyCultureControllerLink,
  SafetyInformationSystem,
  SafetyInformationSystemControllerLink,
  SafetyManagementSystem,
  SafetyManagementSystemControllerLink,
} from '@cast/src/main/models';
import { Chip, ChipPrefix } from '@cast/src/main/services/models';
import { ChipMap } from '@cast/src/main/services/util/ChipMap';
import { toChips } from '@cast/src/main/services/util/toChips';
import {
  toChangesAndDynamicsOverTimeId,
  toCommunicationAndCoordinationId,
  toConstraintId,
  toControllerId,
  toHazardId,
  toInternalAndExternalEconomicsId,
  toResponsibilityId,
  toSafetyCultureId,
  toSafetyInformationSystemId,
  toSafetyManagementSystemId,
} from '@cast/src/main/services/util/toIds';
import { Controller } from '@src-shared/control-structure/models';
import { Id, IdString } from '@src-shared/Interfaces';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function toControllerChipMapBySafetyManagementSystemIds$(
  controller$: Observable<Controller[]>,
  safetyManagementSystems$: Observable<SafetyManagementSystem[]>,
  links$: Observable<SafetyManagementSystemControllerLink[]>
): Observable<ChipMap> {
  return toChipMap$(
    toChips(ChipPrefix.Controller),
    toControllerId,
    toSafetyManagementSystemId
  )([controller$, safetyManagementSystems$, links$]);
}

export function toControllerChipMapBySafetyInformationSystemIds$(
  controller$: Observable<Controller[]>,
  safetyInformationSystems$: Observable<SafetyInformationSystem[]>,
  links$: Observable<SafetyInformationSystemControllerLink[]>
): Observable<ChipMap> {
  return toChipMap$(
    toChips(ChipPrefix.Controller),
    toControllerId,
    toSafetyInformationSystemId
  )([controller$, safetyInformationSystems$, links$]);
}

export function toControllerChipMapBySafetyCultureIds$(
  controller$: Observable<Controller[]>,
  safetyCultures$: Observable<SafetyCulture[]>,
  links$: Observable<SafetyCultureControllerLink[]>
): Observable<ChipMap> {
  return toChipMap$(
    toChips(ChipPrefix.Controller),
    toControllerId,
    toSafetyCultureId
  )([controller$, safetyCultures$, links$]);
}

export function toControllerChipMapByInternalAndExternalEconomicsIds$(
  controller$: Observable<Controller[]>,
  internalAndExternalEconomics$: Observable<InternalAndExternalEconomics[]>,
  links$: Observable<InternalAndExternalEconomicsControllerLink[]>
): Observable<ChipMap> {
  return toChipMap$(
    toChips(ChipPrefix.Controller),
    toControllerId,
    toInternalAndExternalEconomicsId
  )([controller$, internalAndExternalEconomics$, links$]);
}

export function toControllerChipMapByCommunicationAndCoordinationIds$(
  controller$: Observable<Controller[]>,
  communicationAndCoordination$: Observable<CommunicationAndCoordination[]>,
  links$: Observable<CommunicationAndCoordinationController1Link[]>
): Observable<ChipMap> {
  return toChipMap$(
    toChips(ChipPrefix.Controller),
    toControllerId,
    toCommunicationAndCoordinationId
  )([controller$, communicationAndCoordination$, links$]);
}

export function toControllerChipMapByChangesAndDynamicOverTimeIds$(
  controller$: Observable<Controller[]>,
  changesAndDynamicsOverTime$: Observable<ChangesAndDynamicsOverTime[]>,
  links$: Observable<ChangesAndDynamicsOverTimeControllerLink[]>
): Observable<ChipMap> {
  return toChipMap$(
    toChips(ChipPrefix.Controller),
    toControllerId,
    toChangesAndDynamicsOverTimeId
  )([controller$, changesAndDynamicsOverTime$, links$]);
}

export function toControllerChipMapByResponsibilityIds$(
  controller$: Observable<Controller[]>,
  responsibilities$: Observable<Responsibility[]>,
  links$: Observable<ControllerResponsibilityLink[]>
): Observable<ChipMap> {
  return toChipMap$(
    toChips(ChipPrefix.Controller),
    toControllerId,
    toResponsibilityId
  )([controller$, responsibilities$, links$]);
}

export function toConstraintChipMapByResponsibilityIds$(
  constraints$: Observable<Constraint[]>,
  responsibilities$: Observable<Responsibility[]>,
  links$: Observable<ConstraintResponsibilityLink[]>
): Observable<ChipMap> {
  return toChipMap$(
    toChips(ChipPrefix.Constraint),
    toConstraintId,
    toResponsibilityId
  )([constraints$, responsibilities$, links$]);
}

export function toConstraintChipMapByHazardIds$(
  constraints$: Observable<Constraint[]>,
  hazards$: Observable<Hazard[]>,
  links$: Observable<ConstraintHazardLink[]>
): Observable<ChipMap> {
  return toChipMap$(toChips(ChipPrefix.Constraint), toConstraintId, toHazardId)([constraints$, hazards$, links$]);
}

export function toHazardChipMapByConstraintIds$(
  hazards$: Observable<Hazard[]>,
  constraints$: Observable<Constraint[]>,
  links$: Observable<ConstraintHazardLink[]>
): Observable<ChipMap> {
  return toChipMap$(toChips(ChipPrefix.Hazard), toHazardId, toConstraintId)([hazards$, constraints$, links$]);
}

function toChipMap$<T1 extends IdString | Id, T2 extends IdString | Id, L>(
  toChips: (T1, L) => Chip[],
  toChipId: (L) => string,
  toMapById: (L) => string
) {
  return function (observables: [Observable<T1[]>, Observable<T2[]>, Observable<L[]>]): Observable<ChipMap> {
    return combineLatest(observables).pipe(map(toChipMap(toChips, toChipId, toMapById)));
  };
}

function toChipMap(toChips: (T1, L) => Chip[], toChipId: (L) => string, toMapById: (L) => string) {
  return function <T1 extends IdString | Id, T2 extends IdString | Id, L>([modelsToChips, mappedBy, links]: [
    T1[],
    T2[],
    L[]
  ]) {
    const chipMap = new ChipMap();
    mappedBy.forEach(element => {
      chipMap.set(
        element.id.toString(),
        toChips(modelsToChips, links.filter(link => toMapById(link) === element.id.toString()).map(toChipId))
      );
    });
    return chipMap;
  };
}
