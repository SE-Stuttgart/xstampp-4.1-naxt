import { LastId, ProjectId } from '@src-shared/Interfaces';

export class ConversionSensorLastId implements ProjectId, LastId {
  readonly projectId: string = '';
  readonly sensorId: number = -1;
  readonly lastId: number = -1;
}
