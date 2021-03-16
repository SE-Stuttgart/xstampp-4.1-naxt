import { Actuator, ControlledProcess, Controller, Sensor } from '@src-shared/control-structure/models';
import { ActuatorService } from '@src-shared/control-structure/services/system-components/ActuatorService';
import { ControlledProcessService } from '@src-shared/control-structure/services/system-components/ControlledProcessService';
import { ControllerService } from '@src-shared/control-structure/services/system-components/ControllerService';
import { SensorService } from '@src-shared/control-structure/services/system-components/SensorService';
import { injectable, unmanaged } from 'inversify';

@injectable()
export class SystemComponentController {
  constructor(
    @unmanaged() private readonly actuatorService: ActuatorService,
    @unmanaged() private readonly controlledProcessService: ControlledProcessService,
    @unmanaged() private readonly controllerService: ControllerService,
    @unmanaged() private readonly sensorService: SensorService
  ) {}

  public async createActuator(projectId: string): Promise<Actuator> {
    return this.actuatorService.create({ ...new Actuator(), projectId });
  }

  public async updateActuator(actuator: Actuator): Promise<Actuator | null> {
    return this.actuatorService.update(actuator);
  }

  public async removeActuator(actuator: Actuator): Promise<boolean> {
    return this.actuatorService.remove(actuator);
  }

  public async createControlledProcess(projectId: string): Promise<ControlledProcess> {
    return this.controlledProcessService.create({ ...new ControlledProcess(), projectId });
  }

  public async updateControlledProcess(controlledProcess: ControlledProcess): Promise<ControlledProcess | null> {
    return this.controlledProcessService.update(controlledProcess);
  }

  public async removeControlledProcess(controlledProcess: ControlledProcess): Promise<boolean> {
    return this.controlledProcessService.remove(controlledProcess);
  }

  public async createController(projectId: string): Promise<Controller> {
    return this.controllerService.create({ ...new Controller(), projectId });
  }

  public async updateController(controller: Controller): Promise<Controller | null> {
    return this.controllerService.update(controller);
  }

  public async removeController(controller: Controller): Promise<boolean> {
    return this.controllerService.remove(controller);
  }

  public async createSensor(projectId: string): Promise<Sensor> {
    return this.sensorService.create({ ...new Sensor(), projectId });
  }

  public async updateSensor(sensor: Sensor): Promise<Sensor | null> {
    return this.sensorService.update(sensor);
  }

  public async removeSensor(sensor: Sensor): Promise<boolean> {
    return this.sensorService.remove(sensor);
  }
}
