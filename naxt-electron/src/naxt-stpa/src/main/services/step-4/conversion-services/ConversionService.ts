import { Actuator, Sensor } from '@src-shared/control-structure/models';
import { ParentId } from '@src-shared/Interfaces';
import {
  ChipPrefix,
  compareIds,
  ConversionTableEntry,
  ConversionType,
  NestedModels,
  RequiredModels,
} from '@stpa/src/main/services/models';
import { toActuatorChips, toControlActionChips, toSensorChips } from '@stpa/src/main/services/util/chips/toChips';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ActuatorRepo,
  ControlActionRepo,
  ConversionRepo,
  ConversionSensorRepo,
  SensorRepo,
} from '../../../repositories';

@injectable()
export class ConversionService {
  constructor(
    @inject(ConversionRepo) private readonly conversionActuatorRepo: ConversionRepo,
    @inject(ConversionSensorRepo) private readonly conversionSensorRepo: ConversionSensorRepo,
    @inject(ActuatorRepo) private readonly actuatorRepo: ActuatorRepo,
    @inject(SensorRepo) private readonly sensorRepo: SensorRepo,
    @inject(ControlActionRepo) private readonly controlActionRepo: ControlActionRepo
  ) {}

  public getRequiredEntries$(projectId: string): Observable<RequiredModels> {
    return combineLatest([this.actuatorRepo.findAll$(projectId), this.sensorRepo.findAll$(projectId)]).pipe(
      map(([actuators, sensors]) => {
        const requiredModels = new RequiredModels();
        const nestedActuators = new NestedModels(
          { id: 1, name: 'Actuators' },
          ChipPrefix.None,
          Actuator.name,
          actuators.map(actuator => new NestedModels(actuator, ChipPrefix.Actuator, Actuator.name)).sort(compareIds)
        );
        const nestedSensors = new NestedModels(
          { id: 1, name: 'Sensors' },
          ChipPrefix.None,
          Sensor.name,
          sensors.map(sensor => new NestedModels(sensor, ChipPrefix.Sensor, Sensor.name)).sort(compareIds)
        );
        requiredModels.nestedModels.push(nestedActuators, nestedSensors);
        return requiredModels;
      })
    );
  }

  public getAllTableEntries$(projectId: string): Observable<ConversionTableEntry[]> {
    return combineLatest([
      this.conversionActuatorRepo.findAll$(projectId),
      this.conversionSensorRepo.findAll$(projectId),
      this.actuatorRepo.findAll$(projectId),
      this.sensorRepo.findAll$(projectId),
      this.controlActionRepo.findAll$(projectId),
    ]).pipe(
      map(([conversionActuators, conversionSensors, actuators, sensors, controlActions]) => {
        const conversionActuatorTableEntries = conversionActuators.map(conversionActuator => {
          const parentActuator = actuators.find(isParentOf(conversionActuator));
          return new ConversionTableEntry(
            conversionActuator,
            ConversionType.Actuator,
            toActuatorChips(actuators, [parentActuator.id.toString()]),
            toControlActionChips(controlActions, [conversionActuator.controlActionId.toString()])
          );
        });

        const conversionSensorTableEntries = conversionSensors.map(conversionSensor => {
          const parentSensor = sensors.find(isParentOf(conversionSensor));
          return new ConversionTableEntry(
            conversionSensor,
            ConversionType.Sensor,
            toSensorChips(sensors, [parentSensor.id.toString()]),
            toControlActionChips(controlActions, [conversionSensor.controlActionId.toString()])
          );
        });

        return [].concat(conversionActuatorTableEntries, conversionSensorTableEntries);
      })
    );
  }
}

function isParentOf(parent: ParentId) {
  return sensor => sensor.id === parent.parentId;
}
