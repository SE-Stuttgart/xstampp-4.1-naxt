import {
  CommunicationAndCoordinationController1Link,
  CommunicationAndCoordinationController2Link,
} from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class CommunicationAndCoordinationController1LinkRepo extends Repository<
  CommunicationAndCoordinationController1Link
> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(
      CommunicationAndCoordinationController1Link,
      CastBaseQuery.communicationAndCoordinationControllerLink,
      dbConnector
    );
  }

  public async removeAllForCommunicationAndCoordinationId(
    projectId: string,
    communicationAndCoordinationId: string
  ): Promise<CommunicationAndCoordinationController1Link[]> {
    const collection = await this.getCollection();
    return collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('communicationAndCoordinationId')
      .eq(communicationAndCoordinationId)
      .remove();
  }
}

@injectable()
export class CommunicationAndCoordinationController2LinkRepo extends Repository<
  CommunicationAndCoordinationController2Link
> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(
      CommunicationAndCoordinationController2Link,
      CastBaseQuery.communicationAndCoordinationControllerLink,
      dbConnector
    );
  }

  public async removeAllForCommunicationAndCoordinationId(
    projectId: string,
    communicationAndCoordinationId: string
  ): Promise<CommunicationAndCoordinationController2Link[]> {
    const collection = await this.getCollection();
    return collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('communicationAndCoordinationId')
      .eq(communicationAndCoordinationId)
      .remove();
  }
}
