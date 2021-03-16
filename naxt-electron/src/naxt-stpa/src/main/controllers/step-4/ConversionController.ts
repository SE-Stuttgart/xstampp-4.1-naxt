import { Conversion, ConversionSensor } from '@stpa/src/main/models';
import { ConversionTableEntry, RequiredModels } from '@stpa/src/main/services/models';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';
import { ConversionActuatorService, ConversionSensorService, ConversionService } from '../../services';

@injectable()
export class ConversionController {
  constructor(
    @inject(ConversionService) private readonly conversionService: ConversionService,
    @inject(ConversionActuatorService) private readonly conversionActuatorService: ConversionActuatorService,
    @inject(ConversionSensorService) private readonly conversionSensorService: ConversionSensorService
  ) {}

  public async createActuatorConversion(projectId: string, parentId: number): Promise<Conversion> {
    return this.conversionActuatorService.create({ ...new Conversion(), projectId, parentId, actuatorId: parentId });
  }

  public async createSensorConversion(projectId: string, parentId: number): Promise<ConversionSensor> {
    return this.conversionSensorService.create({ ...new ConversionSensor(), projectId, parentId });
  }

  public async updateActuatorConversion(conversion: ConversionTableEntry): Promise<Conversion> {
    return this.conversionActuatorService.update({ ...conversion, actuatorId: conversion.parentId });
  }

  public async updateSensorConversion(conversion: ConversionTableEntry): Promise<ConversionSensor> {
    return this.conversionSensorService.update(conversion);
  }

  public async removeActuatorConversion(conversion: ConversionTableEntry): Promise<boolean> {
    return this.conversionActuatorService.remove({ ...conversion, actuatorId: conversion.parentId });
  }

  public async removeSensorConversion(conversion: ConversionTableEntry): Promise<boolean> {
    return this.conversionSensorService.remove(conversion);
  }

  public getAll$(projectId: string): Observable<ConversionTableEntry[]> {
    return this.conversionService.getAllTableEntries$(projectId);
  }

  public getRequiredEntries$(projectId: string): Observable<RequiredModels> {
    return this.conversionService.getRequiredEntries$(projectId);
  }
}
