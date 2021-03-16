import { sharedCollections } from '@database-access/shared';
import * as electronIsDev from 'electron-is-dev';
// import * as PouchDBInMemoryAdapter from 'pouchdb-adapter-memory';
import * as PouchDBIndexedDBAdapter from 'pouchdb-adapter-indexeddb';
import { addRxPlugin, createRxDatabase, removeRxDatabase, RxDatabase } from 'rxdb';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBNoValidatePlugin } from 'rxdb/plugins/no-validate';
import { stpaCollections, StpaDatabaseCollections } from './schemas';

export type STPADatabase = RxDatabase<StpaDatabaseCollections>;

const DB_VERSION = '_v0';
const DB_NAME = 'stpa_rxdb';
const DB_ADAPTER = 'indexeddb';

const database: Promise<STPADatabase> = _createDatabase(DB_NAME + DB_VERSION, DB_ADAPTER);

async function _createDatabase(dbName: string, dbAdapter: string): Promise<STPADatabase> {
  await _loadRxDBPlugins();

  console.log('Creating STPA database...');
  const _database = await createRxDatabase<STPADatabase>({
    name: dbName,
    adapter: dbAdapter,
    multiInstance: false,
  });

  await Promise.all(stpaCollections.map(collection => _database.collection(collection)));
  await Promise.all(sharedCollections.map(collection => _database.collection(collection)));

  console.log('Database STPA ready.');
  return _database;
}

async function _loadRxDBPlugins(): Promise<void> {
  addRxPlugin(PouchDBIndexedDBAdapter);
  addRxPlugin(RxDBLeaderElectionPlugin);
  if (electronIsDev) await import('rxdb/plugins/dev-mode').then(addRxPlugin);
  else addRxPlugin(RxDBNoValidatePlugin);
}

export async function connectToDatabase(): Promise<STPADatabase> {
  return database;
}

export async function destroyDB(): Promise<boolean> {
  return database.then(database => database.destroy());
}

export async function removeDB(): Promise<void> {
  return removeRxDatabase(DB_NAME, DB_ADAPTER);
}
