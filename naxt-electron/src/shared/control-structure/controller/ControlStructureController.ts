import {
  Actuator,
  ControlAction,
  ControlledProcess,
  Controller,
  ControlStructure,
  Feedback,
  Input,
  Output,
  Sensor,
} from '@src-shared/control-structure/models';
import { ControlStructureService } from '@src-shared/control-structure/services/ControlStructureService';
import { ControlActionService } from '@src-shared/control-structure/services/information-flow/ControlActionService';
import { FeedbackService } from '@src-shared/control-structure/services/information-flow/FeedbackService';
import { InputService } from '@src-shared/control-structure/services/information-flow/InputService';
import { OutputService } from '@src-shared/control-structure/services/information-flow/OutputService';
import { ActuatorService } from '@src-shared/control-structure/services/system-components/ActuatorService';
import { ControlledProcessService } from '@src-shared/control-structure/services/system-components/ControlledProcessService';
import { ControllerService } from '@src-shared/control-structure/services/system-components/ControllerService';
import { SensorService } from '@src-shared/control-structure/services/system-components/SensorService';
import { injectable, unmanaged } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class ControlStructureController {
  constructor(
    @unmanaged() private readonly controlStructureService: ControlStructureService,
    @unmanaged() private readonly controlActionService: ControlActionService,
    @unmanaged() private readonly feedbackService: FeedbackService,
    @unmanaged() private readonly inputService: InputService,
    @unmanaged() private readonly outputService: OutputService,
    @unmanaged() private readonly actuatorService: ActuatorService,
    @unmanaged() private readonly controlledProcessService: ControlledProcessService,
    @unmanaged() private readonly controllerService: ControllerService,
    @unmanaged() private readonly sensorService: SensorService
  ) {}

  public getControlStructure(projectId: string, parent?: number): Observable<ControlStructure> {
    return this.controlStructureService.getCS$(projectId, parent);
  }

  public updateControlStructure(controlStructure: ControlStructure): Promise<ControlStructure> {
    return this.controlStructureService.updateCS(controlStructure);
  }

  public async createControlAction(controlAction: ControlAction): Promise<ControlAction> {
    return this.controlStructureService.createControlAction(controlAction);
  }

  public async updateControlAction(controlAction: ControlAction): Promise<ControlAction | null> {
    return this.controlActionService.update(controlAction);
  }

  public async removeControlAction(controlAction: ControlAction): Promise<boolean> {
    return this.controlActionService.remove(controlAction);
  }

  public getAllControlActions$(projectId: string): Observable<ControlAction[]> {
    return this.controlActionService.getAll$(projectId);
  }

  public async createFeedback(feedback: Feedback): Promise<Feedback> {
    return this.controlStructureService.createFeedback(feedback);
  }

  public async updateFeedback(feedback: Feedback): Promise<Feedback | null> {
    return this.feedbackService.update(feedback);
  }

  public async removeFeedback(feedback: Feedback): Promise<boolean> {
    return this.feedbackService.remove(feedback);
  }

  public getAllFeedback$(projectId: string): Observable<Feedback[]> {
    return this.feedbackService.getAll$(projectId);
  }

  public async createInput(input: Input): Promise<Input> {
    return this.controlStructureService.createInput(input);
  }

  public async updateInput(input: Input): Promise<Input | null> {
    return this.inputService.update(input);
  }

  public async removeInput(input: Input): Promise<boolean> {
    return this.inputService.remove(input);
  }

  public getAllInputs$(projectId: string): Observable<Input[]> {
    return this.inputService.getAll$(projectId);
  }

  public async createOutput(output: Output): Promise<Output> {
    return this.controlStructureService.createOutput(output);
  }

  public async updateOutput(output: Output): Promise<Output | null> {
    return this.outputService.update(output);
  }

  public async removeOutput(output: Output): Promise<boolean> {
    return this.outputService.remove(output);
  }

  public getAllOutputs$(projectId: string): Observable<Output[]> {
    return this.outputService.getAll$(projectId);
  }

  public async createActuator(actuator: Actuator): Promise<Actuator> {
    return this.controlStructureService.createActuator(actuator);
  }

  public async updateActuator(actuator: Actuator): Promise<Actuator | null> {
    return this.actuatorService.update(actuator);
  }

  public async removeActuator(actuator: Actuator): Promise<boolean> {
    return this.actuatorService.remove(actuator);
  }

  public getAllActuators$(projectId: string): Observable<Actuator[]> {
    return this.actuatorService.getAll$(projectId);
  }

  public async createControlledProcess(controlledProcess: ControlledProcess): Promise<ControlledProcess> {
    return this.controlStructureService.createControlledProcess(controlledProcess);
  }

  public async updateControlledProcess(controlledProcess: ControlledProcess): Promise<ControlledProcess | null> {
    return this.controlledProcessService.update(controlledProcess);
  }

  public async removeControlledProcess(controlledProcess: ControlledProcess): Promise<boolean> {
    return this.controlledProcessService.remove(controlledProcess);
  }

  public getAllControlledProcesses$(projectId: string): Observable<ControlledProcess[]> {
    return this.controlledProcessService.getAll$(projectId);
  }

  public async createController(controller: Controller): Promise<Controller> {
    return this.controlStructureService.createController(controller);
  }

  public async updateController(controller: Controller): Promise<Controller | null> {
    return this.controllerService.update(controller);
  }

  public async removeController(controller: Controller): Promise<boolean> {
    return this.controllerService.remove(controller);
  }

  public getAllControllers$(projectId: string): Observable<Controller[]> {
    return this.controllerService.getAll$(projectId);
  }

  public async createSensor(sensor: Sensor): Promise<Sensor> {
    return this.controlStructureService.createSensor(sensor);
  }

  public async updateSensor(sensor: Sensor): Promise<Sensor | null> {
    return this.sensorService.update(sensor);
  }

  public async removeSensor(sensor: Sensor): Promise<boolean> {
    return this.sensorService.remove(sensor);
  }

  public getAllControlledSensors$(projectId: string): Observable<Sensor[]> {
    return this.sensorService.getAll$(projectId);
  }

  public async updateBoxLinkActuator(projectId: string, actuatorId: number, boxId: string): Promise<Actuator> {
    return this.controlStructureService.updateBoxLinkActuator(projectId, actuatorId, boxId);
  }

  public async updateBoxLinkController(projectId: string, controllerId: number, boxId: string): Promise<Controller> {
    return this.controlStructureService.updateBoxLinkController(projectId, controllerId, boxId);
  }

  public async updateBoxLinkSensor(projectId: string, sensorId: number, boxId: string): Promise<Sensor> {
    return this.controlStructureService.updateBoxLinkSensor(projectId, sensorId, boxId);
  }

  public async updateBoxLinkControlledProcess(
    projectId: string,
    controlledProcessId: number,
    boxId: string
  ): Promise<ControlledProcess> {
    return this.controlStructureService.updateBoxLinkControlledProcess(projectId, controlledProcessId, boxId);
  }

  public async updateArrowLinksControlAction(
    projectId: string,
    controlActionIds: number[],
    arrowId: string
  ): Promise<ControlAction[]> {
    return this.controlStructureService.updateArrowLinksControlAction(projectId, controlActionIds, arrowId);
  }

  public async updateArrowLinksFeedback(
    projectId: string,
    feedbackIds: number[],
    arrowId: string
  ): Promise<Feedback[]> {
    return this.controlStructureService.updateArrowLinksFeedback(projectId, feedbackIds, arrowId);
  }

  public async updateArrowLinksInput(projectId: string, inputIds: number[], arrowId: string): Promise<Input[]> {
    return this.controlStructureService.updateArrowLinksInput(projectId, inputIds, arrowId);
  }

  public async updateArrowLinksOutput(projectId: string, outputIds: number[], arrowId: string): Promise<Output[]> {
    return this.controlStructureService.updateArrowLinksOutput(projectId, outputIds, arrowId);
  }
}
