import { Actuator, ControlledProcess, Controller, Sensor } from '@src-shared/control-structure/models';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActuatorRepo, ControlledProcessRepo, ControllerRepo, SensorRepo } from '../../../repositories';
import {
  ActuatorTableEntry,
  ControlledProcessTableEntry,
  ControllerTableEntry,
  SensorTableEntry,
  SystemComponentTableEntry,
} from '../../models';

@injectable()
export class SystemComponentService {
  constructor(
    @inject(ActuatorRepo) private readonly actuatorRepo: ActuatorRepo,
    @inject(ControlledProcessRepo) private readonly controlledProcessRepo: ControlledProcessRepo,
    @inject(ControllerRepo) private readonly controllerRepo: ControllerRepo,
    @inject(SensorRepo) private readonly sensorRepo: SensorRepo
  ) {}

  public getAllTableEntries$(projectId: string): Observable<SystemComponentTableEntry[]> {
    return combineLatest([
      this.actuatorRepo.findAll$(projectId),
      this.controlledProcessRepo.findAll$(),
      this.controllerRepo.findAll$(projectId),
      this.sensorRepo.findAll$(projectId),
    ]).pipe(
      map(([actuators, controlledProcesses, controller, sensors]) => {
        return [].concat(
          actuators.map(toActuatorTableEntry),
          controller.map(toControllerTableEntry),
          sensors.map(toSensorTableEntry),
          controlledProcesses.filter(hasSameProjectId(projectId)).map(toControlledProcessTableEntry) // TODO: why the fuck is this necessary
        );
      })
    );
  }
}

function toActuatorTableEntry(actuator: Actuator): ActuatorTableEntry {
  return new ActuatorTableEntry(actuator);
}

function toControllerTableEntry(controller: Controller): ControllerTableEntry {
  return new ControllerTableEntry(controller);
}

function toSensorTableEntry(sensor: Sensor): SensorTableEntry {
  return new SensorTableEntry(sensor);
}

function toControlledProcessTableEntry(controlledProcess: ControlledProcess): ControlledProcessTableEntry {
  return new ControlledProcessTableEntry(controlledProcess);
}

function hasSameProjectId(projectId: string) {
  return controlledProcess => controlledProcess.projectId === projectId;
}
