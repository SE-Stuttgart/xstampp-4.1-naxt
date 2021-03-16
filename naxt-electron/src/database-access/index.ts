import { CASTDatabase } from './cast';
import { STPADatabase } from './stpa';

export type NAXTDatabase = STPADatabase | CASTDatabase;
export interface DBConnector {
  connectToDatabase: () => Promise<NAXTDatabase>;
}
