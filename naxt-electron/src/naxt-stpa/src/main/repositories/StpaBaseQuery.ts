import { EntityDependent, IdString, ProjectDependent, ProjectId } from '@src-shared/Interfaces';
import {
  HazardLossLink,
  HazardSystemConstraintLink,
  ProcessModelProcessVariableLink,
  ProcessVariableResponsibilityLink,
  ResponsibilitySubSystemConstraintLink,
  ResponsibilitySystemConstraintLink,
  UnsafeControlActionHazardLink,
  UnsafeControlActionSubHazardLink,
} from '@stpa/src/main/models';

export class StpaBaseQuery {
  public static entityDependent<T extends EntityDependent>({ projectId, parentId, id }: T): any {
    return { selector: { projectId: { $eq: projectId }, parentId: { $eq: parentId }, id: { $eq: id } } };
  }

  public static projectDependent<T extends ProjectDependent>({ projectId, id }: T): any {
    return { selector: { projectId: { $eq: projectId }, id: { $eq: id } } };
  }

  public static idString<T extends ProjectId & IdString>({ projectId, id }: T): any {
    return { selector: { projectId: { $eq: projectId }, id: { $eq: id } } };
  }

  public static projectId<T extends ProjectId>({ projectId }: T): any {
    return { selector: { projectId: { $eq: projectId } } };
  }

  public static hazardLossLink<T extends HazardLossLink>({ projectId, lossId, hazardId }: T): any {
    return { selector: { projectId: { $eq: projectId }, lossId: { $eq: lossId }, hazardId: { $eq: hazardId } } };
  }

  public static hazardSystemConstraintLink<T extends HazardSystemConstraintLink>({
    projectId,
    systemConstraintId,
    hazardId,
  }: T): any {
    return {
      selector: {
        projectId: { $eq: projectId },
        systemConstraintId: { $eq: systemConstraintId },
        hazardId: { $eq: hazardId },
      },
    };
  }

  public static processModelProcessVariableLink<T extends ProcessModelProcessVariableLink>({
    projectId,
    processModelId,
    processVariableId,
  }: T): any {
    return {
      selector: {
        projectId: { $eq: projectId },
        processModelId: { $eq: processModelId },
        processVariableId: { $eq: processVariableId },
      },
    };
  }

  public static processVariableResponsibilityLink<T extends ProcessVariableResponsibilityLink>({
    projectId,
    responsibilityId,
    processVariableId,
  }: T): any {
    return {
      selector: {
        projectId: { $eq: projectId },
        responsibilityId: { $eq: responsibilityId },
        processVariableId: { $eq: processVariableId },
      },
    };
  }

  public static responsibilitySystemConstraintLink<T extends ResponsibilitySystemConstraintLink>({
    projectId,
    responsibilityId,
    systemConstraintId,
  }: T): any {
    return {
      selector: {
        projectId: { $eq: projectId },
        responsibilityId: { $eq: responsibilityId },
        systemConstraintId: { $eq: systemConstraintId },
      },
    };
  }

  public static responsibilitySubSystemConstraintLink<T extends ResponsibilitySubSystemConstraintLink>({
    projectId,
    responsibilityId,
    systemConstraintId,
    subSystemConstraintId,
  }: T): any {
    return {
      selector: {
        projectId: { $eq: projectId },
        responsibilityId: { $eq: responsibilityId },
        systemConstraintId: { $eq: systemConstraintId },
        subSystemConstraintId: { $eq: subSystemConstraintId },
      },
    };
  }

  public static unsafeControlActionHazardLink<T extends UnsafeControlActionHazardLink>({
    projectId,
    hazardId,
    controlActionId,
    unsafeControlActionId,
  }: T): any {
    return {
      selector: {
        projectId: { $eq: projectId },
        hazardId: { $eq: hazardId },
        controlActionId: { $eq: controlActionId },
        unsafeControlActionId: { $eq: unsafeControlActionId },
      },
    };
  }

  public static unsafeControlActionSubHazardLink<T extends UnsafeControlActionSubHazardLink>({
    projectId,
    hazardId,
    subHazardId,
    controlActionId,
    unsafeControlActionId,
  }: T): any {
    return {
      selector: {
        projectId: { $eq: projectId },
        hazardId: { $eq: hazardId },
        subHazardId: { $eq: subHazardId },
        controlActionId: { $eq: controlActionId },
        unsafeControlActionId: { $eq: unsafeControlActionId },
      },
    };
  }
}
