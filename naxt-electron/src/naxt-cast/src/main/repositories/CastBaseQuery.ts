import {
  ChangesAndDynamicsOverTimeControllerLink,
  CommunicationAndCoordinationControllerLink,
  ConstraintHazardLink,
  ConstraintResponsibilityLink,
  ControllerResponsibilityLink,
  InternalAndExternalEconomicsControllerLink,
  QuestionComponentLink,
  SafetyCultureControllerLink,
  SafetyInformationSystemControllerLink,
  SafetyManagementSystemControllerLink,
} from '@cast/src/main/models';
import { Id, IdString, ParentIdString, ProjectId } from '@src-shared/Interfaces';

export type EqSelector = { selector: {} };

export class CastBaseQuery {
  public static projectId<T extends ProjectId>({ projectId }: T): EqSelector {
    return { selector: { projectId: { $eq: projectId } } };
  }

  public static id<T extends ProjectId & IdString>({ projectId, id }: T): EqSelector {
    return { selector: { projectId: { $eq: projectId }, id: { $eq: id } } };
  }

  public static parentId<T extends ProjectId & ParentIdString & IdString>({ projectId, parentId, id }: T): EqSelector {
    return { selector: { projectId: { $eq: projectId }, parentId: { $eq: parentId }, id: { $eq: id } } };
  }

  public static idNumber<T extends ProjectId & Id>({ projectId, id }: T): EqSelector {
    return { selector: { projectId: { $eq: projectId }, id: { $eq: id } } };
  }

  public static constraintHazardLink<T extends ConstraintHazardLink>({
    projectId,
    hazardId,
    constraintId,
  }: T): EqSelector {
    return {
      selector: { projectId: { $eq: projectId }, hazardId: { $eq: hazardId }, constraintId: { $eq: constraintId } },
    };
  }

  public static constraintResponsibilityLink<T extends ConstraintResponsibilityLink>({
    projectId,
    responsibilityId,
    constraintId,
  }: T): EqSelector {
    return {
      selector: {
        projectId: { $eq: projectId },
        responsibilityId: { $eq: responsibilityId },
        constraintId: { $eq: constraintId },
      },
    };
  }

  public static controllerResponsibilityLink<T extends ControllerResponsibilityLink>({
    projectId,
    controllerId,
    responsibilityId,
  }: T): EqSelector {
    return {
      selector: {
        projectId: { $eq: projectId },
        controllerId: { $eq: controllerId },
        responsibilityId: { $eq: responsibilityId },
      },
    };
  }

  public static safetyManagementSystemControllerLink<T extends SafetyManagementSystemControllerLink>({
    projectId,
    controllerId,
    safetyManagementSystemId,
  }: T): EqSelector {
    return {
      selector: {
        projectId: { $eq: projectId },
        controllerId: { $eq: controllerId },
        safetyManagementSystemId: { $eq: safetyManagementSystemId },
      },
    };
  }

  public static safetyInformationSystemControllerLink<T extends SafetyInformationSystemControllerLink>({
    projectId,
    controllerId,
    safetyInformationSystemId,
  }: T): EqSelector {
    return {
      selector: {
        projectId: { $eq: projectId },
        controllerId: { $eq: controllerId },
        safetyInformationSystemId: { $eq: safetyInformationSystemId },
      },
    };
  }

  public static safetyCultureControllerLink<T extends SafetyCultureControllerLink>({
    projectId,
    controllerId,
    safetyCultureId,
  }: T): EqSelector {
    return {
      selector: {
        projectId: { $eq: projectId },
        controllerId: { $eq: controllerId },
        safetyCultureId: { $eq: safetyCultureId },
      },
    };
  }

  public static internalAndExternalEconomicsControllerLink<T extends InternalAndExternalEconomicsControllerLink>({
    projectId,
    controllerId,
    internalAndExternalEconomicsId,
  }: T): EqSelector {
    return {
      selector: {
        projectId: { $eq: projectId },
        controllerId: { $eq: controllerId },
        internalAndExternalEconomicsId: { $eq: internalAndExternalEconomicsId },
      },
    };
  }

  public static communicationAndCoordinationControllerLink<T extends CommunicationAndCoordinationControllerLink>({
    projectId,
    controllerId,
    communicationAndCoordinationId,
  }: T): EqSelector {
    return {
      selector: {
        projectId: { $eq: projectId },
        controllerId: { $eq: controllerId },
        communicationAndCoordinationId: { $eq: communicationAndCoordinationId },
      },
    };
  }

  public static changesAndDynamicsOverTimeControllerLink<T extends ChangesAndDynamicsOverTimeControllerLink>({
    projectId,
    controllerId,
    changesAndDynamicsOverTimeId,
  }: T): EqSelector {
    return {
      selector: {
        projectId: { $eq: projectId },
        controllerId: { $eq: controllerId },
        changesAndDynamicsOverTimeId: { $eq: changesAndDynamicsOverTimeId },
      },
    };
  }

  public static questionComponentLink<T extends QuestionComponentLink>({
    projectId,
    questionId,
    componentId,
    componentType,
  }: T): EqSelector {
    return {
      selector: {
        projectId: { $eq: projectId },
        questionId: { $eq: questionId },
        componentId: { $eq: componentId },
        componentType: { $eq: componentType },
      },
    };
  }
}
