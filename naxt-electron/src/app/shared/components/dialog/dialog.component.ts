import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogData, DialogResult, DialogResultType } from './dialog.types';
import { ElectronService } from '@core/services/electron/electron.service';

@Component({
  selector: 'naxt-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  extra: string;
  path: string;
  data: DialogData;

  findDirectory(): void {
    this.electronService.remote.dialog
      .showOpenDialog({ properties: ['openDirectory'] })
      .then(result => {
        this.path = result.filePaths[0];
        //this.data.type = 'path';
      })
      .catch(err => {
        console.log(err);
      });
  }
  get dissmissText(): string {
    return !!this.data && !!this.data.dismissButtonText
      ? this.data.dismissButtonText
      : this.translate.instant('DIALOG.DISSMISS');
  }

  get acceptText(): string {
    return !!this.data && !!this.data.acceptButtonText
      ? this.data.acceptButtonText
      : this.translate.instant('DIALOG.ACCEPT');
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) data: DialogData,
    private _dialogRef: MatDialogRef<DialogData, DialogResult>,
    private readonly translate: TranslateService,
    private readonly electronService: ElectronService
  ) {
    this.data = data;
  }

  dismiss(): void {
    this._dialogRef.close({ type: DialogResultType.DISSMISSED });
  }

  accept(): void {
    if (!!this.data?.inputLabel && (!this.extra || this.extra.length <= 0)) this.data?.showError();
    else if (!!this.data?.labelDirectoryPathField && (!this.path || this.path.length <= 0)) this.data?.showError();
    else if (!!this.data?.inputLabel && this.extra && this.extra.length > 0 && !this.data?.labelDirectoryPathField)
      this._dialogRef.close({ type: DialogResultType.ACCEPTED, extra: this.extra });
    else this._dialogRef.close({ type: DialogResultType.ACCEPTED, extra: this.extra, path: this.path });
  }
}
