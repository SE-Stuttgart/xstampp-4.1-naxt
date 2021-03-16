import { Id, IdString, ParentId } from '@src-shared/Interfaces';
import { ProcessModelProcessVariableLink } from '@stpa/src/main/models';
import {
  ControlActionId,
  HazardId,
  LossId,
  ResponsibilityId,
  SubHazardId,
  SubSystemConstraintId,
  SystemConstraintId,
  UnsafeControlActionId,
} from '@stpa/src/main/models/links/Interfaces';

export function toLossLinkId(link: LossId): string {
  return link.lossId.toString();
}

export function toHazardLinkId(link: HazardId): string {
  return link.hazardId.toString();
}

export function toSubHazardLinkId(link: HazardId & SubHazardId): string {
  return combineIds(link.hazardId, link.subHazardId);
}

export function toSystemConstraintLinkId(link: SystemConstraintId): string {
  return link.systemConstraintId.toString();
}

export function toSubSystemConstraintLinkId(link: SystemConstraintId & SubSystemConstraintId): string {
  return combineIds(link.systemConstraintId, link.subSystemConstraintId);
}

export function toResponsibilityLinkId(link: ResponsibilityId): string {
  return link.responsibilityId.toString();
}

export function toUnsafeControlActionLinkId(link: ControlActionId & UnsafeControlActionId): string {
  return combineIds(link.controlActionId, link.unsafeControlActionId);
}

export function toProcessModelLinkId(link: ProcessModelProcessVariableLink): string {
  return link.processModelId.toString();
}

export function toProcessVariableLinkId(link: ProcessModelProcessVariableLink): string {
  return link.processVariableId.toString();
}

export function toCombinedStringId(entity: IdString | Id | (Id & ParentId)): string {
  if (entity.hasOwnProperty('parentId')) return combineIds((entity as any).parentId, entity.id);
  return entity.id.toString();
}

export function combineIds(parentId: any, id: any): string {
  return `${parentId}.${id}`;
}
