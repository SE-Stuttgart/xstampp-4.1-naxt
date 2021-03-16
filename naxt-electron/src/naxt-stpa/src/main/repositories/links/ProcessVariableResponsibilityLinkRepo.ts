import { Repository } from '@src-shared/rxdb-repository/Repository';
import { ProcessVariableResponsibilityLink } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class ProcessVariableResponsibilityLinkRepo extends Repository<ProcessVariableResponsibilityLink> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(ProcessVariableResponsibilityLink, StpaBaseQuery.processVariableResponsibilityLink, dbConnector);
  }

  async removeAllByResponsibilityId(
    projectId: string,
    responsibilityId: number
  ): Promise<ProcessVariableResponsibilityLink[]> {
    const collection = await this.getCollection();
    return collection.find().where('projectId').eq(projectId).where('responsibilityId').eq(responsibilityId).remove();
  }

  async removeAllByProcessVariableId(
    projectId: string,
    processVariableId: number
  ): Promise<ProcessVariableResponsibilityLink[]> {
    const collection = await this.getCollection();
    return collection.find().where('projectId').eq(projectId).where('processVariableId').eq(processVariableId).remove();
  }
}
