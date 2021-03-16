import {
  ChangesAndDynamicsOverTimeControllerLink,
  CommunicationAndCoordinationController1Link,
  InternalAndExternalEconomicsControllerLink,
  SafetyCultureControllerLink,
  SafetyInformationSystemControllerLink,
  SafetyManagementSystemControllerLink,
} from '@cast/src/main/models';
import { ConstraintId, ControllerId, HazardId, ResponsibilityId } from '@cast/src/main/models/links/Interfaces';

export function toConstraintId(link: ConstraintId): string {
  return link.constraintId;
}

export function toHazardId(link: HazardId): string {
  return link.hazardId;
}

export function toResponsibilityId(link: ResponsibilityId): string {
  return link.responsibilityId;
}

export function toControllerId(link: ControllerId): string {
  return link.controllerId.toString();
}

export function toChangesAndDynamicsOverTimeId(link: ChangesAndDynamicsOverTimeControllerLink): string {
  return link.changesAndDynamicsOverTimeId;
}

export function toCommunicationAndCoordinationId(link: CommunicationAndCoordinationController1Link): string {
  return link.communicationAndCoordinationId;
}

export function toInternalAndExternalEconomicsId(link: InternalAndExternalEconomicsControllerLink): string {
  return link.internalAndExternalEconomicsId;
}

export function toSafetyCultureId(link: SafetyCultureControllerLink): string {
  return link.safetyCultureId;
}

export function toSafetyInformationSystemId(link: SafetyInformationSystemControllerLink): string {
  return link.safetyInformationSystemId;
}

export function toSafetyManagementSystemId(link: SafetyManagementSystemControllerLink): string {
  return link.safetyManagementSystemId;
}
