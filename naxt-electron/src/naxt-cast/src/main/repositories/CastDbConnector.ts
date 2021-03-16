import { CASTDatabase, connectToDatabase } from '@database-access/cast';
import { DBConnector } from '@database-access/index';
import { injectable } from 'inversify';

@injectable()
export class CastDBConnector implements DBConnector {
  public async connectToDatabase(): Promise<CASTDatabase> {
    return connectToDatabase();
  }
}
