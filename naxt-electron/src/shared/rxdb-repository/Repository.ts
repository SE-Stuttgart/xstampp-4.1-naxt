import { DBConnector, NAXTDatabase } from '@database-access/index';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { injectable, unmanaged } from 'inversify';
import { RxCollection } from 'rxdb';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@injectable()
export abstract class Repository<T> {
  protected readonly collectionName: string;
  protected readonly map: (obj: T) => T;

  protected constructor(
    @unmanaged() private readonly clazz: { new (): T },
    @unmanaged() private readonly baseQuery: (T) => any,
    @unmanaged() private readonly dbConnector: DBConnector
  ) {
    this.clazz = clazz;
    this.collectionName = clazz.name.toLowerCase();
    this.dbConnector = dbConnector;
    this.map = createMapper(clazz);
  }

  public async insert(obj: T): Promise<T> {
    const exists = await this._exists(obj);
    if (exists) throw new NAXTError('Object to insert already exists:', obj);

    const collection = await this.getCollection();
    const document = await collection.insert(this.map(obj));
    return this.map(document);
  }

  public async insertAll(objs: T[]): Promise<{ success: T[]; error: any }> {
    const collection = await this.getCollection();
    const document = await collection.bulkInsert(objs.map(this.map));
    return {
      success: document.success.map(this.map),
      error: document.error,
    };
  }

  public async update(obj: T): Promise<T | null> {
    const collection = await this.getCollection();
    const document = await collection.findOne(this.baseQuery(obj)).update({ $set: this.map(obj) });
    return !document ? document : this.map(document);
  }

  public async _remove(obj: T): Promise<boolean> {
    const exists = await this._exists(obj);
    if (!exists) throw new NAXTError('Object to remove does not exist:', obj);

    const collection = await this.getCollection();
    const document = await collection.findOne(this.baseQuery(obj)).remove();
    return !!document;
  }

  public async removeAll(projectId: string): Promise<boolean> {
    const collection = await this.getCollection();
    const document = await collection.find().where('projectId').eq(projectId).remove();
    return !!document;
  }

  public async _exists(obj: T): Promise<boolean> {
    const collection = await this.getCollection();
    const document = await collection.findOne(this.baseQuery(obj)).exec();
    return !!document;
  }

  public async _find(obj: T): Promise<T> {
    const collection = await this.getCollection();
    const document = await collection.findOne(this.baseQuery(obj)).exec();
    return this.map(document);
  }

  public _find$(obj: T): Observable<T | null> {
    return from(this._find$inPromise(obj)).pipe(mergeMap(v => v));
  }

  private async _find$inPromise(obj: T): Promise<Observable<T | null>> {
    const collection = await this.getCollection();
    const document$ = collection.findOne(this.baseQuery(obj)).$;
    return document$.pipe(
      map(next => {
        if (next) return this.map(next);
        return null;
      })
    );
  }

  public async findAll(projectId?: string): Promise<T[]> {
    const collection = await this.getCollection();
    if (!!projectId)
      return collection
        .find()
        .where('projectId')
        .eq(projectId)
        .exec()
        .then(documents => documents.map(this.map));
    return collection
      .find()
      .exec()
      .then(documents => documents.map(this.map));
  }

  public findAll$(projectId?: string): Observable<T[]> {
    return from(this._findAll$(projectId)).pipe(mergeMap(v => v));
  }

  private async _findAll$(projectId?: string): Promise<Observable<T[]>> {
    const collection = await this.getCollection();
    if (!!projectId)
      return collection
        .find()
        .where('projectId')
        .eq(projectId)
        .$.pipe(map((objs: T[]) => objs.map(this.map)));
    return collection.find().$.pipe(map((objs: T[]) => objs.map(this.map)));
  }

  protected async getCollection(): Promise<RxCollection<T>> {
    function isCollection(str: string | number | symbol, database: NAXTDatabase): str is keyof NAXTDatabase {
      return database.hasOwnProperty(str);
    }

    const database = await this.dbConnector.connectToDatabase();
    if (!isCollection(this.collectionName, database))
      throw new NAXTError('No such collection in database:', {
        dbName: database.name,
        collection: this.collectionName,
      });
    return database[this.collectionName];
  }
}

function createMapper<T>(clazz: { new (): T }) {
  return function (obj: T): T {
    if (!obj) return obj;
    const newObj: any = {};
    for (const prop in new clazz()) newObj[prop] = obj[prop];
    return newObj;
  };
}
