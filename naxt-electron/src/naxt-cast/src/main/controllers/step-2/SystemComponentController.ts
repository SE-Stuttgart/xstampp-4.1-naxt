import { ProcessVariable } from '@cast/src/main/models';
import {
  ActuatorService,
  ControlledProcessService,
  ControllerService,
  ProcessVariableService,
  SensorService,
} from '@cast/src/main/services';
import { SystemComponentTableModel } from '@cast/src/main/services/models/table-models/step-2/SystemComponentTableModel';
import { SystemComponentService } from '@cast/src/main/services/step-2/control-structure-services/SystemComponentService';
import { SystemComponentController as SharedSystemComponentController } from '@src-shared/control-structure/controller/SystemComponentController';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class SystemComponentController extends SharedSystemComponentController {
  constructor(
    @inject(ActuatorService) actuatorService: ActuatorService,
    @inject(ControlledProcessService) controlledProcessService: ControlledProcessService,
    @inject(ControllerService) controllerService: ControllerService,
    @inject(SensorService) sensorService: SensorService,
    @inject(SystemComponentService) private readonly systemComponentService: SystemComponentService,
    @inject(ProcessVariableService) private readonly processVariableService: ProcessVariableService
  ) {
    super(actuatorService, controlledProcessService, controllerService, sensorService);
  }

  public getAllTableModel$(projectId: string): Observable<SystemComponentTableModel[]> {
    return this.systemComponentService.getAllTableModels$(projectId);
  }

  public async createProcessVariable(processVariable: ProcessVariable): Promise<ProcessVariable> {
    return this.processVariableService.create(processVariable);
  }

  public async updateProcessVariable(processVariable: ProcessVariable): Promise<ProcessVariable> {
    return this.processVariableService.update(processVariable);
  }

  public async removeProcessVariable(processVariable: ProcessVariable): Promise<boolean> {
    return this.processVariableService.remove(processVariable);
  }
}
