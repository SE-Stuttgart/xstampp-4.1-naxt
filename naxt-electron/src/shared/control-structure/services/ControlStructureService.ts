import {
  Actuator,
  Arrow,
  Box,
  ControlAction,
  ControlledProcess,
  Controller,
  ControlStructure,
  Feedback,
  Input,
  Output,
  Sensor,
  VectorGraphic,
} from '@src-shared/control-structure/models';
import { Service } from '@src-shared/control-structure/services/common/Service';
import { ControlActionService } from '@src-shared/control-structure/services/information-flow/ControlActionService';
import { FeedbackService } from '@src-shared/control-structure/services/information-flow/FeedbackService';
import { InputService } from '@src-shared/control-structure/services/information-flow/InputService';
import { OutputService } from '@src-shared/control-structure/services/information-flow/OutputService';
import { ActuatorService } from '@src-shared/control-structure/services/system-components/ActuatorService';
import { ControlledProcessService } from '@src-shared/control-structure/services/system-components/ControlledProcessService';
import { ControllerService } from '@src-shared/control-structure/services/system-components/ControllerService';
import { SensorService } from '@src-shared/control-structure/services/system-components/SensorService';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { Arrowed, Boxed, Id, ProjectId, UnchangedSavesSetter } from '@src-shared/Interfaces';
import { Project } from '@src-shared/project/Project';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { injectable, unmanaged } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@injectable()
export class ControlStructureService {
  constructor(
    @unmanaged() private readonly _projectRepo: Repository<Project> & UnchangedSavesSetter,
    @unmanaged() private readonly _arrowRepository: Repository<Arrow>,
    @unmanaged() private readonly _boxRepository: Repository<Box>,
    @unmanaged() private readonly _vectorGraphicRepo: Repository<VectorGraphic>,
    @unmanaged() private readonly _actuatorService: ActuatorService,
    @unmanaged() private readonly _controlledProcessService: ControlledProcessService,
    @unmanaged() private readonly _controllerService: ControllerService,
    @unmanaged() private readonly _sensorService: SensorService,
    @unmanaged() private readonly _controlActionService: ControlActionService,
    @unmanaged() private readonly _feedbackService: FeedbackService,
    @unmanaged() private readonly _inputService: InputService,
    @unmanaged() private readonly _outputService: OutputService
  ) {}

  public getCS$(projectId: string, parent?: number): Observable<ControlStructure> {
    return combineLatest([
      this._getAllBoxes$(projectId, parent),
      this._getAllArrows$(projectId, parent),
      this._vectorGraphicRepo._find$({ ...new VectorGraphic(), projectId }),
    ]).pipe(
      map(([boxes, arrows, vectorGraphic]) => {
        return new ControlStructure(
          projectId,
          vectorGraphic?.graphic ?? '',
          vectorGraphic?.blackWhiteGraphic ?? '',
          boxes,
          arrows
        );
      })
    );
  }

  private _getAllBoxes$(projectId: string, parent?: number): Observable<Box[]> {
    const boxes = this._boxRepository.findAll$(projectId);
    return boxes.pipe(map(boxes => boxes.filter(isBoxParent(parent))));
  }

  private _getAllArrows$(projectId: string, parent?: number): Observable<Arrow[]> {
    const arrows = this._arrowRepository.findAll$(projectId);
    return arrows.pipe(map(arrows => arrows.filter(isArrowParent(parent))));
  }

  public async updateCS(controlStructure: ControlStructure): Promise<ControlStructure> {
    const projectExists = await this.projectExists(controlStructure.projectId);
    if (!projectExists) throw new NAXTError('No such project exists:', controlStructure);

    const newControlStructure = new ControlStructure('', '', '', [], []);

    await Promise.all([
      this._arrowRepository
        .removeAll(controlStructure.projectId)
        .then(() => this._arrowRepository.insertAll(controlStructure.arrows))
        .then(result => newControlStructure.arrows.push(...result.success)),
      this._boxRepository
        .removeAll(controlStructure.projectId)
        .then(() => this._boxRepository.insertAll(controlStructure.boxes))
        .then(result => newControlStructure.boxes.push(...result.success)),
      this._vectorGraphicRepo
        .update({
          projectId: controlStructure.projectId,
          graphic: controlStructure.svg,
          blackWhiteGraphic: controlStructure.blackAndWhiteSVG,
        })
        .then(vectorGraphic => {
          newControlStructure.svg = vectorGraphic.graphic;
          newControlStructure.svg = vectorGraphic.blackWhiteGraphic;
        }),
    ]).then(() => this._projectRepo.setUnsavedChanges(controlStructure.projectId, true));

    return newControlStructure;
  }

  private async projectExists(projectId: string): Promise<boolean> {
    return this._projectRepo._exists({ ...new Project(), projectId });
  }

  public async createControlAction(controlAction: ControlAction): Promise<ControlAction> {
    return this._controlActionService.create(controlAction);
  }

  public async createFeedback(feedback: Feedback): Promise<Feedback> {
    return this._feedbackService.create(feedback);
  }

  public async createInput(input: Input): Promise<Input> {
    return this._inputService.create(input);
  }

  public async createOutput(output: Output): Promise<Output> {
    return this._outputService.create(output);
  }

  public async createActuator(actuator: Actuator): Promise<Actuator> {
    return this.create(actuator, this._actuatorService);
  }

  public async createController(controller: Controller): Promise<Controller> {
    return this.create(controller, this._controllerService);
  }

  public async createSensor(sensor: Sensor): Promise<Sensor> {
    return this.create(sensor, this._sensorService);
  }

  public async createControlledProcess(controlledProcess: ControlledProcess): Promise<ControlledProcess> {
    return this.create(controlledProcess, this._controlledProcessService);
  }

  private async create<T extends ProjectId & Id & Boxed>(obj: T, service: Service<T>): Promise<T> {
    const { projectId, boxId } = obj;
    if (hasSetBoxId(obj)) await this.removeBoxIdFromAllSystemComponents(projectId, boxId);
    return service.create(obj);
  }

  public async updateBoxLinkActuator(projectId: string, actuatorId: number, boxId: string): Promise<Actuator> {
    return this.updateBoxLink(projectId, actuatorId, boxId, this._actuatorService);
  }

  public async updateBoxLinkController(projectId: string, controllerId: number, boxId: string): Promise<Controller> {
    return this.updateBoxLink(projectId, controllerId, boxId, this._controllerService);
  }

  public async updateBoxLinkSensor(projectId: string, sensorId: number, boxId: string): Promise<Sensor> {
    return this.updateBoxLink(projectId, sensorId, boxId, this._sensorService);
  }

  public async updateBoxLinkControlledProcess(
    projectId: string,
    controlledProcessId: number,
    boxId: string
  ): Promise<ControlledProcess> {
    return this.updateBoxLink(projectId, controlledProcessId, boxId, this._controlledProcessService);
  }

  private async updateBoxLink<T extends ProjectId & Id & Boxed>(
    projectId: string,
    sensorId: number,
    boxId: string,
    service: Service<T>
  ): Promise<T> {
    await this.removeBoxIdFromAllSystemComponents(projectId, boxId);
    const oldSensor = await service.get(projectId, sensorId);
    return service.update({ ...oldSensor, boxId });
  }

  public async updateArrowLinksControlAction(
    projectId: string,
    controlActionIds: number[],
    arrowId: string
  ): Promise<ControlAction[]> {
    return this.updateArrowLinks(projectId, controlActionIds, arrowId, this._controlActionService);
  }

  public async updateArrowLinksFeedback(
    projectId: string,
    feedbackIds: number[],
    arrowId: string
  ): Promise<Feedback[]> {
    return this.updateArrowLinks(projectId, feedbackIds, arrowId, this._feedbackService);
  }

  public async updateArrowLinksInput(projectId: string, inputIds: number[], arrowId: string): Promise<Input[]> {
    return this.updateArrowLinks(projectId, inputIds, arrowId, this._inputService);
  }

  public async updateArrowLinksOutput(projectId: string, outputIds: number[], arrowId: string): Promise<Output[]> {
    return this.updateArrowLinks(projectId, outputIds, arrowId, this._outputService);
  }

  private async updateArrowLinks<T extends ProjectId & Id & Arrowed>(
    projectId: string,
    entityIds: number[],
    arrowId: string,
    service: Service<T>
  ): Promise<T[]> {
    const promises = [];
    entityIds.forEach(entityId => promises.push(this.updateArrowLink(projectId, entityId, arrowId, service)));
    return await Promise.all(promises);
  }

  private async updateArrowLink<T extends ProjectId & Id & Arrowed>(
    projectId: string,
    entityId: number,
    inputId: string,
    service: Service<T>
  ): Promise<T> {
    await this.removeArrowIdFromAllInformationFlows(projectId, inputId);
    const oldEntity = await service.get(projectId, entityId);
    return service.update({ ...oldEntity, arrowId: inputId });
  }

  private async removeBoxIdFromAllSystemComponents(projectId: string, boxId: string): Promise<void> {
    const promises = [];
    promises.push(...removeBoxIds(projectId, boxId, this._actuatorService));
    promises.push(...removeBoxIds(projectId, boxId, this._controlledProcessService));
    promises.push(...removeBoxIds(projectId, boxId, this._controllerService));
    promises.push(...removeBoxIds(projectId, boxId, this._sensorService));
    await Promise.all(promises);
  }

  private async removeArrowIdFromAllInformationFlows(projectId: string, arrowId: string): Promise<void> {
    const promises = [];
    promises.push(...removeArrowIds(projectId, arrowId, this._controlActionService));
    promises.push(...removeArrowIds(projectId, arrowId, this._feedbackService));
    promises.push(...removeArrowIds(projectId, arrowId, this._inputService));
    promises.push(...removeArrowIds(projectId, arrowId, this._outputService));
    await Promise.all(promises);
  }
}

function isBoxParent(parent?: number) {
  return function (box: Box): boolean {
    if (!parent) return true;
    return box.parent === parent;
  };
}

function isArrowParent(parent?: number) {
  return function (arrow: Arrow): boolean {
    if (!parent) return true;
    return arrow.parents === parent.toString();
  };
}

function hasSetBoxId<T extends Boxed>(obj: T): boolean {
  return obj.boxId !== '';
}

function removeBoxIds<T extends ProjectId & Id & Boxed>(projectId: string, boxId: string, service: Service<T>): any[] {
  const promises = [];
  service
    .getAll(projectId)
    .then(objects => objects.filter(object => object.boxId === boxId))
    .then(objects => objects.forEach(object => promises.push(service.update({ ...object, boxId: '' }))));
  return promises;
}

function removeArrowIds<T extends ProjectId & Id & Arrowed>(
  projectId: string,
  boxId: string,
  service: Service<T>
): any[] {
  const promises = [];
  service
    .getAll(projectId)
    .then(objects => objects.filter(object => object.arrowId === boxId))
    .then(objects => objects.forEach(object => promises.push(service.update({ ...object, arrowId: '' }))));
  return promises;
}
