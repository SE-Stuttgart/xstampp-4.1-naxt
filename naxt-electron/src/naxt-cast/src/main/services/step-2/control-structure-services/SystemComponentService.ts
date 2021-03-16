import { ActuatorRepo, ControlledProcessRepo, ControllerRepo, SensorRepo } from '@cast/src/main/repositories';
import {
  ActuatorTableModel,
  ControlledProcessTableModel,
  SensorTableModel,
  SystemComponentTableModel,
} from '@cast/src/main/services/models';
import { ControllerTableModel } from '@cast/src/main/services/models/table-models/step-2/SystemComponentTableModel';
import { ProcessVariableService } from '@cast/src/main/services/step-2/control-structure-services/ProcessVariableService';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@injectable()
export class SystemComponentService {
  constructor(
    @inject(ActuatorRepo) private readonly actuatorRepo: ActuatorRepo,
    @inject(ControlledProcessRepo) private readonly controlledProcessRepo: ControlledProcessRepo,
    @inject(ControllerRepo) private readonly controllerRepo: ControllerRepo,
    @inject(SensorRepo) private readonly sensorRepo: SensorRepo,
    @inject(ProcessVariableService) private readonly processVariableService: ProcessVariableService
  ) {}

  public getAllTableModels$(projectId: string): Observable<SystemComponentTableModel[]> {
    return combineLatest([
      this.actuatorRepo.findAll$(projectId),
      this.controlledProcessRepo.findAll$(),
      this.controllerRepo.findAll$(projectId),
      this.sensorRepo.findAll$(projectId),
      this.processVariableService.getMapByControllerId$(projectId),
    ]).pipe(
      map(([actuators, controlledProcesses, controllers, sensors, processVariablesMap]) => {
        return [].concat(
          actuators.map(actuator => new ActuatorTableModel(actuator)),
          sensors.map(sensor => new SensorTableModel(sensor)),
          controllers.map(controller => new ControllerTableModel(controller, processVariablesMap.get(controller.id))),
          controlledProcesses.filter(cp => cp.projectId === projectId).map(cp => new ControlledProcessTableModel(cp)) // TODO: why the dumb fuck is this necessary
        );
      })
    );
  }
}
