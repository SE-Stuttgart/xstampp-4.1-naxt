import { SystemComponentController as SharedSystemComponentController } from '@src-shared/control-structure/controller/SystemComponentController';
import {
  ActuatorService,
  ControlledProcessService,
  ControllerService,
  SensorService,
  SystemComponentService,
} from '@stpa/src/main/services';
import { SystemComponentTableEntry } from '@stpa/src/main/services/models';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class SystemComponentController extends SharedSystemComponentController {
  constructor(
    @inject(ActuatorService) actuatorService: ActuatorService,
    @inject(ControlledProcessService) controlledProcessService: ControlledProcessService,
    @inject(ControllerService) controllerService: ControllerService,
    @inject(SensorService) sensorService: SensorService,
    @inject(SystemComponentService) private readonly systemComponentService: SystemComponentService
  ) {
    super(actuatorService, controlledProcessService, controllerService, sensorService);
  }

  public getAll$(projectId: string): Observable<SystemComponentTableEntry[]> {
    return this.systemComponentService.getAllTableEntries$(projectId);
  }
}
