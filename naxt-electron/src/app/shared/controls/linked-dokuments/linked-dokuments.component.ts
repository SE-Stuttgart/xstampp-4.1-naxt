import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ElectronService } from '@core/services/electron/electron.service';
import { BrowserWindow, shell } from 'electron';
import { DialogLinkedDocumentsComponent } from './dialog-linked-documents/dialog-linked-documents.component';
import { LinkedDocuments } from '@src-shared/Interfaces';
import { MessageService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';

export interface DialogData {
  name: string;
  path: string;
  type: string;
}
//const { BrowserWindow } = require('electron').remote;
@Component({
  selector: 'naxt-linked-dokuments',
  templateUrl: './linked-dokuments.component.html',
  styleUrls: ['./linked-dokuments.component.scss'],
})
export class LinkedDokumentsComponent {
  @Input() set linkedDokumentList(v: LinkedDocuments[]) {
    v?.forEach(ele =>
      this.linkedDokumentslist.set(ele.path + ele.fileName, {
        name: ele.fileName,
        path: ele.path,
        type: ele.type,
      })
    );
  }

  @Output() linkedDokumentListChange: EventEmitter<LinkedDocuments[]> = new EventEmitter<LinkedDocuments[]>();

  name: string = '';
  path: string = '';
  type: string = '';
  private key: string = '';
  private browserWindow: typeof BrowserWindow;
  linkedDokumentslist: Map<string, DialogData> = new Map<string, DialogData>();
  sideNavButton: boolean = true;
  constructor(
    private readonly dialog: MatDialog,
    private readonly electronService: ElectronService,
    private readonly msg: MessageService,
    private readonly translate: TranslateService
  ) {
    this.browserWindow = this.electronService.remote.BrowserWindow;
  }
  toggle(sidenav: any): void {
    sidenav.toggle();
    this.sideNavButton = !this.sideNavButton;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogLinkedDocumentsComponent, {
      width: '450px',
      data: { name: this.name, path: this.path, type: this.type },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== '') {
        this.key = result.path + result.name;
        this.linkedDokumentslist.set(this.key, result);
        this.emitChanges();
      }
    });
  }

  openFile(item): void {
    console.warn(item);
    if (item.value.type === 'url') {
      let win = new this.browserWindow({ width: 800, height: 600, show: false });
      win.on('closed', () => {
        win = null;
      });
      // for url
      win
        .loadURL(item.value.path)
        .then(() => {
          win.show();
        })
        .catch(() => {
          this.msg.info(this.translate.instant('CAST.INCORRECTURL'));
        });
    } else {
      if (this.electronService.fs.existsSync(item.value.path)) {
        shell.openPath(item.value.path);
      } else {
        this.msg.info(this.translate.instant('CAST.INCORRECTPATH'));
      }
    }

    // works if pdf viewer is there shell.openItem(item.value.path);
    //opens url in browser shell.openExternal(item.value.path);
  }

  delete(item): void {
    this.linkedDokumentslist.delete(item.key);
    this.emitChanges();
  }

  change(item): void {
    const dialogRef = this.dialog.open(DialogLinkedDocumentsComponent, {
      width: '450px',
      data: { name: item.value.name, path: item.value.path, type: item.value.type },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.name !== undefined && result.path !== undefined) {
        this.linkedDokumentslist.delete(item.key);
        this.key = result.path + result.name;
        this.linkedDokumentslist.set(this.key, result);
        this.emitChanges();
      }
    });
  }

  emitChanges(): void {
    const tempList: LinkedDocuments[] = [];
    this.linkedDokumentslist.forEach(ele =>
      tempList.push({
        fileName: ele.name,
        path: ele.path,
        type: ele.type,
      })
    );

    this.linkedDokumentListChange.emit(tempList);
  }
}
