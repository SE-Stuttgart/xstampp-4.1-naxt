import { BrowserWindow, ipcMain, Menu, MenuItem } from 'electron';
import { StoreAccessor } from './settings';
import { IpcKeys, StoreKeys } from './enum-keys';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { dialog } = require('electron');

function isDev(): boolean {
  return process.mainModule.filename.indexOf('app.asar') === -1;
}

function isMac(): boolean {
  return process.platform === 'darwin';
}

ipcMain.on(IpcKeys.SET_LANGUAGE, (event, args) => {
  createMenu(args === 'de');
});

// add Menu Items here!
export function createMenu(isGerman: boolean = false): void {
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: isGerman ? 'Neues STPA Projekt' : 'New STPA Project',
          click(item: MenuItem, mainWindow: BrowserWindow) {
            mainWindow.webContents.send(IpcKeys.NEW_STPA, 'newStpa');
          },
        },
        {
          label: 'New CAST Project',
          click(item: MenuItem, mainWindow: BrowserWindow) {
            mainWindow.webContents.send(IpcKeys.NEW_CAST, 'newCast');
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Open Project...',
          click(item: MenuItem, mainWindow: BrowserWindow) {
            mainWindow.webContents.send(IpcKeys.OPEN_PROJECT, 'openProject');
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Save',
          click(item: MenuItem, mainWindow: BrowserWindow) {
            mainWindow.webContents.send(IpcKeys.SAVE_PROJECT, 'saveProject');
          },
        },
        {
          label: 'Save As...',
          click(item: MenuItem, mainWindow: BrowserWindow) {
            mainWindow.webContents.send(IpcKeys.SAVE_PROJECT_AS, 'saveProjectAs');
          },
        },
        // {
        //   label: 'import stpa project (from XSTAMPP 4.1)',
        //   click(item: MenuItem, mainWindow: BrowserWindow) {
        //     mainWindow.webContents.send(IpcKeys.IMPORT_PROJECT, 'importProject');
        //   },
        // },
        {
          type: 'separator',
        },
        {
          label: 'Settings',
        },
        {
          type: 'separator',
        },
        {
          role: 'close',
          label: isGerman ? 'Fenster Schließen' : 'Close Window',
        },
        { role: 'quit', label: isGerman ? 'Schließen' : 'Quit', visible: isMac() },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo',
        },
        {
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          role: 'cut',
        },
        {
          role: 'copy',
        },
        {
          role: 'paste',
        },
        {
          role: 'delete',
        },
        {
          role: 'selectAll',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload', visible: isDev() },
        { role: 'forceReload', visible: isDev() },
        { role: 'toggleDevTools', visible: isDev() },
        { type: 'separator', visible: isDev() },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'reset',
          click(item: MenuItem, mainWindow: BrowserWindow) {
            mainWindow.webContents.send('reset');
          },
        },
      ],
    },
    {
      label: isGerman ? 'Einstellungen' : 'settings',
      submenu: [
        {
          label: isGerman ? 'Change to English' : 'Change to German',
          click(item: MenuItem, mainWindow: BrowserWindow) {
            mainWindow.webContents.send(IpcKeys.LANGUAGE, isGerman ? 'en' : 'de');
            StoreAccessor.getInstance().store.set(StoreKeys.LANGUAGE, isGerman ? 'en' : 'de');
          },
        },
        {
          label: getExtendedLabel(isGerman),
          click(item: MenuItem, mainWindow: BrowserWindow) {
            StoreAccessor.getInstance().store.set(StoreKeys.EXTENDED, !isExtended());
            mainWindow.webContents.send(IpcKeys.EXTENDED, isExtended());
            createMenu(isGerman);
          },
        },
        {
          label: getparserModeLabel(isGerman),
          click(item: MenuItem, mainWindow: BrowserWindow) {
            StoreAccessor.getInstance().store.set(StoreKeys.IS_PROMELA_MODE, !isPromela());
            mainWindow.webContents.send(IpcKeys.IS_PROMELA, isPromela());
            createMenu(isGerman);
          },
        },
        {
          label: isGerman ? 'NuSMV Pfad setzen' : 'set NuSMV path',
          click(item: MenuItem, mainWindow: BrowserWindow) {
            dialog
              .showOpenDialog({
                properties: ['openFile'],
              })
              .then(result => {
                StoreAccessor.getInstance().store.set(StoreKeys.NUSMV, result.filePaths[0]);
                mainWindow.webContents.send(IpcKeys.NUSMV, result.filePaths[0]);
              })
              .catch(err => {
                console.log(err);
              });
          },
        },
        {
          label: isGerman ? 'SPIN Pfad setzen' : 'set SPIN path',
          click(item: MenuItem, mainWindow: BrowserWindow) {
            dialog
              .showOpenDialog({
                properties: ['openFile'],
              })
              .then(result => {
                StoreAccessor.getInstance().store.set(StoreKeys.SPIN, result.filePaths[0]);
                mainWindow.webContents.send(IpcKeys.SPIN, result.filePaths[0]);
              })
              .catch(err => {
                console.log(err);
              });
          },
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
}

function isExtended(): boolean {
  return StoreAccessor?.getInstance()?.store?.get(StoreKeys.EXTENDED);
}

function getExtendedLabel(isGerman: boolean): string {
  if (isGerman) return !isExtended() ? 'Erweiterte Felder anzeigen' : 'Erweiterte Felder verstecken';
  else return !isExtended() ? 'show extended fields' : 'hide extended fields';
}

function isPromela(): boolean {
  return StoreAccessor?.getInstance()?.store?.get(StoreKeys.IS_PROMELA_MODE);
}

function getparserModeLabel(isGerman: boolean): string {
  if (isGerman) return !isPromela() ? 'In SPIN Modus wechseln' : 'In NuSMV Modus wechseln';
  else return !isPromela() ? 'switch to SPIN mode' : 'switch to NuSMV mode';
}
