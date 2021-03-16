import { sharedCollections } from '@database-access/shared';
import * as electronIsDev from 'electron-is-dev';
// import * as PouchDBInMemoryAdapter from 'pouchdb-adapter-memory';
import * as PouchDBIndexedDBAdapter from 'pouchdb-adapter-indexeddb';
import { addRxPlugin, createRxDatabase, removeRxDatabase, RxDatabase } from 'rxdb';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBNoValidatePlugin } from 'rxdb/plugins/no-validate';
import { castCollections, CastDatabaseCollections } from './schemas';

export type CASTDatabase = RxDatabase<CastDatabaseCollections>;

const DB_VERSION = '_v0';
const DB_NAME = 'cast_rxdb';
const DB_ADAPTER = 'indexeddb';

const database: Promise<CASTDatabase> = _createDatabase(DB_NAME + DB_VERSION, DB_ADAPTER);

async function _createDatabase(dbName: string, dbAdapter: string): Promise<CASTDatabase> {
  await _loadRxDBPlugins();

  console.log('Creating CAST database...');
  const _database = await createRxDatabase<CASTDatabase>({
    name: dbName,
    adapter: dbAdapter,
    multiInstance: false,
  });

  await Promise.all(castCollections.map(collection => _database.collection(collection)));
  await Promise.all(sharedCollections.map(collection => _database.collection(collection)));

  console.log('Database CAST ready.');
  return _database;
}

async function _loadRxDBPlugins(): Promise<void> {
  addRxPlugin(PouchDBIndexedDBAdapter);
  addRxPlugin(RxDBLeaderElectionPlugin);
  if (electronIsDev) {
    await import('rxdb/plugins/dev-mode').then(addRxPlugin);
    console.log('Add dev plugins for RxDB...');
  } else addRxPlugin(RxDBNoValidatePlugin);
}

export async function connectToDatabase(): Promise<CASTDatabase> {
  return database;
}

export async function destroyDB(): Promise<boolean> {
  return database.then(database => database.destroy());
}

export async function removeDB(): Promise<void> {
  return removeRxDatabase(DB_NAME, DB_ADAPTER);
}
