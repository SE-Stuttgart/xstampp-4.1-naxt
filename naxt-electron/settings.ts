import * as Store from 'electron-store';
import { ipcMain } from 'electron';
import { IpcKeys } from './enum-keys';

const schema: Store.Options<any> = {
  schema: {
    language: {
      type: 'string',
      default: 'en',
    },
  },
};

export class StoreAccessor {
  private static instance: StoreAccessor;
  readonly store: Store = new Store(schema);

  public static getInstance(): StoreAccessor {
    if (!StoreAccessor.instance) {
      StoreAccessor.instance = new StoreAccessor();
    }

    return StoreAccessor.instance;
  }

  private constructor() {
    ipcMain.handle(IpcKeys.STORE, (event, key) => {
      return this.store.get(key);
    });
  }
}
