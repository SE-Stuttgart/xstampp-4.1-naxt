import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Subscriptions } from '@shared/utils';
import { tap } from 'rxjs/operators';
import { BrowserWindow } from 'electron';
import { ElectronService } from '@core/services/electron/electron.service';
import * as path from 'path';
import { TranslateService } from '@ngx-translate/core';

export interface DialogData {
  name: string;
  path: string;
  type: string;
}
@Component({
  selector: 'naxt-dialog-linked-documents',
  templateUrl: './dialog-linked-documents.component.html',
  styleUrls: ['./dialog-linked-documents.component.css'],
})
export class DialogLinkedDocumentsComponent implements OnInit, OnDestroy {
  data: DialogData;
  label: string = '';
  path: string = '';
  pathLabel: string = 'select path';
  urlLabel: string = 'enter url';
  disabled: boolean = false;
  selected: number = 0;
  buttonDisable: boolean = true;
  disableUrlTab: boolean = false;
  disablePathTab: boolean = false;
  private readonly subscriptions: Subscriptions = new Subscriptions();
  browserWindow: typeof BrowserWindow;

  constructor(
    private readonly dialogRef: MatDialogRef<DialogLinkedDocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) data: DialogData,
    private readonly electronService: ElectronService,
    private readonly translate: TranslateService
  ) {
    // new BrowserWindow for edit links
    this.browserWindow = electronService.remote.BrowserWindow;
    this.label = translate.instant('CAST.NAME');
    this.pathLabel = translate.instant('CAST.PATHLABEL');
    this.urlLabel = translate.instant('CAST.URLLABEL');
    this.data = data;
  }

  ngOnInit(): void {
    //for edit entries
    if (this.data.type === 'url') {
      this.urlFormControl.setValue(this.data.path);
      this.textUrlFormControl.setValue(this.data.name);
      this.selected = 0;
      this.disablePathTab = true;
      this.buttonDisable = false;
    } else if (this.data.type === 'path') {
      this.pathFormControl.setValue(this.data.path);
      this.textPathFormControl.setValue(this.data.name);
      this.selected = 1;
      this.disableUrlTab = true;
      this.buttonDisable = false;
    }

    //observables
    this.subscriptions.plusOne = this.pathFormControl.valueChanges
      .pipe(
        tap(v => {
          this.data.path = v;
          this.data.type = 'path';
          if (this.data.name !== '' || this.data.path !== '') {
            this.disableUrlTab = true;
            this.buttonDisable = true;
          } else {
            this.disableUrlTab = false;
            this.buttonDisable = true;
          }
          if (this.data.name !== '' && this.data.path !== '') {
            this.buttonDisable = false;
          }
        })
      )
      .subscribe();
    this.subscriptions.plusOne = this.urlFormControl.valueChanges
      .pipe(
        tap(v => {
          this.data.path = v;
          this.data.type = 'url';
          if (this.data.name !== '' || this.data.path !== '') {
            this.disablePathTab = true;
            this.buttonDisable = true;
          } else {
            this.disablePathTab = false;
            this.buttonDisable = true;
          }
          if (this.data.name !== '' && this.data.path !== '') {
            this.buttonDisable = false;
          }
        })
      )
      .subscribe();
    this.subscriptions.plusOne = this.textUrlFormControl.valueChanges
      .pipe(
        tap(v => {
          this.data.name = v;
          if (this.data.name !== '' || this.data.path !== '') {
            this.disablePathTab = true;
            this.buttonDisable = true;
          } else {
            this.disablePathTab = false;
            this.buttonDisable = true;
          }
          if (this.data.name !== '' && this.data.path !== '') {
            this.buttonDisable = false;
          }
        })
      )
      .subscribe();
    this.subscriptions.plusOne = this.textPathFormControl.valueChanges
      .pipe(
        tap(v => {
          this.data.name = v;
          if (this.data.name !== '' || this.data.path !== '') {
            this.disableUrlTab = true;
            this.buttonDisable = true;
          } else {
            this.disableUrlTab = false;
            this.buttonDisable = true;
          }
          if (this.data.name !== '' && this.data.path !== '') {
            this.buttonDisable = false;
          }
        })
      )
      .subscribe();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  urlFormControl = new FormControl('', [Validators.required]);
  pathFormControl = new FormControl('');
  textUrlFormControl = new FormControl('');
  textPathFormControl = new FormControl('');
  onNoClick(): void {
    this.dialogRef.close();
  }
  findDirectory(): void {
    this.electronService.remote.dialog
      .showOpenDialog({ properties: ['openFile'], filters: [{ name: 'PDFs', extensions: ['pdf'] }] })
      .then(result => {
        if (!result.canceled) {
          this.pathFormControl.setValue(result.filePaths[0]);
          if (this.textPathFormControl.value === '') {
            this.textPathFormControl.setValue(path.basename(result.filePaths[0]));
          }
        }
        if (result.canceled) {
          if (this.textPathFormControl.value !== '' && result.filePaths[0] !== '') {
            this.buttonDisable = false;
          }
        }
        //this.data.type = 'path';
      })
      .catch(err => {
        console.log(err);
      });
  }

  //auskommentieren falls checkbox verwendet werden soll
  // triggerEvent(): void {
  //   this.disabled = !this.disabled;
  // }
}
