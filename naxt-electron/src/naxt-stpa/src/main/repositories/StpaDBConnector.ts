import { DBConnector } from '@database-access/index';
import { connectToDatabase, STPADatabase } from '@database-access/stpa';
import { injectable } from 'inversify';

@injectable()
export class StpaDBConnector implements DBConnector {
  public async connectToDatabase(): Promise<STPADatabase> {
    return connectToDatabase();
  }
}
