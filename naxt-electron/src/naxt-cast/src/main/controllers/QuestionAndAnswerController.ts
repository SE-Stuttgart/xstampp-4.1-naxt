import {
  ChangesAndDynamicsOverTime,
  CommunicationAndCoordination,
  Constraint,
  Event,
  Hazard,
  InternalAndExternalEconomics,
  QuestionAndAnswer,
  QuestionComponentLink,
  Responsibility,
  RoleInTheAccident,
  SafetyCulture,
  SafetyInformationSystem,
  SafetyManagementSystem,
} from '@cast/src/main/models';
import {
  QuestionAndAnswerService,
  QuestionAndAnswerTableModel,
  QuestionComponentLinkService,
} from '@cast/src/main/services';
import {
  Actuator,
  ControlAction,
  ControlledProcess,
  Controller,
  Feedback,
  Input,
  Output,
  Sensor,
} from '@src-shared/control-structure/models';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class QuestionAndAnswerController {
  constructor(
    @inject(QuestionAndAnswerService) private readonly service: QuestionAndAnswerService,
    @inject(QuestionComponentLinkService) private readonly linkService: QuestionComponentLinkService
  ) {}

  public async createQuestionAnswer(qna: QuestionAndAnswer): Promise<QuestionAndAnswer> {
    return this.service.create(qna);
  }

  public async updateQuestionAnswer(qna: QuestionAndAnswer): Promise<QuestionAndAnswer> {
    return this.service.update(qna);
  }

  public async removeQuestionAnswer(qna: QuestionAndAnswer): Promise<boolean> {
    return this.service.remove(qna);
  }

  public getAll$(projectId: string): Observable<QuestionAndAnswerTableModel[]> {
    return this.service.getAllTableModels$(projectId);
  }

  public async createHazardLink(
    projectId: string,
    hazardId: string,
    questionId: string
  ): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(projectId, hazardId, questionId, Hazard);
  }

  public async createConstraintLink(
    projectId: string,
    constraintId: string,
    questionId: string
  ): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(projectId, constraintId, questionId, Constraint);
  }

  public async createEventLink(projectId: string, eventId: string, questionId: string): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(projectId, eventId, questionId, Event);
  }

  public async createResponsibilityLink(
    projectId: string,
    responsibilityId: string,
    questionId: string
  ): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(projectId, responsibilityId, questionId, Responsibility);
  }

  public async createControlActionLink(
    projectId: string,
    controlActionId: number,
    questionId: string
  ): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(projectId, controlActionId, questionId, ControlAction);
  }

  public async createFeedbackLink(
    projectId: string,
    feedbackId: number,
    questionId: string
  ): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(projectId, feedbackId, questionId, Feedback);
  }

  public async createInputLink(projectId: string, inputId: number, questionId: string): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(projectId, inputId, questionId, Input);
  }

  public async createOutputLink(
    projectId: string,
    outputId: number,
    questionId: string
  ): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(projectId, outputId, questionId, Output);
  }

  public async createActuatorLink(
    projectId: string,
    actuatorId: number,
    questionId: string
  ): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(projectId, actuatorId, questionId, Actuator);
  }

  public async createControlledProcessLink(
    projectId: string,
    controlledProcessId: number,
    questionId: string
  ): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(projectId, controlledProcessId, questionId, ControlledProcess);
  }

  public async createControllerLink(
    projectId: string,
    controllerId: number,
    questionId: string
  ): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(projectId, controllerId, questionId, Controller);
  }

  public async createSensorLink(
    projectId: string,
    sensorId: number,
    questionId: string
  ): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(projectId, sensorId, questionId, Sensor);
  }

  public async createRoleInTheAccidentLink(
    projectId: string,
    roleInTheAccidentId: string,
    questionId: string
  ): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(projectId, roleInTheAccidentId, questionId, RoleInTheAccident);
  }

  public async createCommunicationAndCoordinationLink(
    projectId: string,
    communicationAndCoordinationId: string,
    questionId: string
  ): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(
      projectId,
      communicationAndCoordinationId,
      questionId,
      CommunicationAndCoordination
    );
  }

  public async createSafetyInformationSystemLink(
    projectId: string,
    safetyInformationSystemId: string,
    questionId: string
  ): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(
      projectId,
      safetyInformationSystemId,
      questionId,
      SafetyInformationSystem
    );
  }

  public async createSafetyManagementSystemLink(
    projectId: string,
    safetyManagementSystemId: string,
    questionId: string
  ): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(
      projectId,
      safetyManagementSystemId,
      questionId,
      SafetyManagementSystem
    );
  }

  public async createSafetyCultureLink(
    projectId: string,
    safetyCultureId: string,
    questionId: string
  ): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(projectId, safetyCultureId, questionId, SafetyCulture);
  }

  public async createChangesAndDynamicsOverTimeLink(
    projectId: string,
    changesAndDynamicsOverTimeId: string,
    questionId: string
  ): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(
      projectId,
      changesAndDynamicsOverTimeId,
      questionId,
      ChangesAndDynamicsOverTime
    );
  }

  public async createInternalAndExternalEconomicsLink(
    projectId: string,
    internalAndExternalEconomicsId: string,
    questionId: string
  ): Promise<QuestionComponentLink> {
    return this.linkService.createComponentLink(
      projectId,
      internalAndExternalEconomicsId,
      questionId,
      InternalAndExternalEconomics
    );
  }

  public async removeLink(projectId: string, componentId: string | number, questionId: string): Promise<boolean> {
    return this.linkService.removeComponentLink(projectId, componentId, questionId);
  }

  public async removeLinkForControlAction(
    projectId: string,
    controlActionId: string | number,
    questionId: string
  ): Promise<boolean> {
    return this.linkService.removeComponentLinkForComponent(projectId, controlActionId, questionId, ControlAction);
  }

  public async removeLinkForFeedback(
    projectId: string,
    feedbackId: string | number,
    questionId: string
  ): Promise<boolean> {
    return this.linkService.removeComponentLinkForComponent(projectId, feedbackId, questionId, Feedback);
  }

  public async removeLinkForInput(projectId: string, inputId: string | number, questionId: string): Promise<boolean> {
    return this.linkService.removeComponentLinkForComponent(projectId, inputId, questionId, Input);
  }

  public async removeLinkForOutput(projectId: string, outputId: string | number, questionId: string): Promise<boolean> {
    return this.linkService.removeComponentLinkForComponent(projectId, outputId, questionId, Output);
  }

  public async removeLinkForActuator(
    projectId: string,
    actuatorId: string | number,
    questionId: string
  ): Promise<boolean> {
    return this.linkService.removeComponentLinkForComponent(projectId, actuatorId, questionId, Actuator);
  }

  public async removeLinkForControlledProcess(
    projectId: string,
    controlledProcessId: string | number,
    questionId: string
  ): Promise<boolean> {
    return this.linkService.removeComponentLinkForComponent(
      projectId,
      controlledProcessId,
      questionId,
      ControlledProcess
    );
  }

  public async removeLinkForController(
    projectId: string,
    controllerId: string | number,
    questionId: string
  ): Promise<boolean> {
    return this.linkService.removeComponentLinkForComponent(projectId, controllerId, questionId, Controller);
  }

  public async removeLinkForSensor(projectId: string, sensorId: string | number, questionId: string): Promise<boolean> {
    return this.linkService.removeComponentLinkForComponent(projectId, sensorId, questionId, Sensor);
  }
}
