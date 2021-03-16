import { Injectable } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BottomSheetComponent } from '@shared/components/bottom-sheet/bottom-sheet.component';
import { DialogComponent, DialogData, DialogResult, DialogResultType } from '@shared/components/dialog';
import { BehaviorSubject } from 'rxjs';
import { finalize, first, tap } from 'rxjs/operators';
import {
  BottomSheetData,
  BottomSheetResult,
  BottomSheetReturnType,
} from '@shared/components/bottom-sheet/bottomSheet.types';
import { TableEntry } from '@src-shared/Interfaces';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  // subject for canleaveservice
  dialogIsOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  bottomSheetIsOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private _dialogModal: MatDialog,
    private _bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar,
    private readonly translate: TranslateService
  ) {}

  bottomSheet<X extends TableEntry>(
    opt: MatBottomSheetConfig<BottomSheetData<X, TableEntry, TableEntry>> & {
      data: BottomSheetData<X, TableEntry, TableEntry>;
    },
    callBacks?: { dissmiss?: () => void; accept?: (result: BottomSheetResult<X, TableEntry, TableEntry>) => void }
  );
  bottomSheet<X extends TableEntry, Y extends TableEntry>(
    opt: MatBottomSheetConfig<BottomSheetData<X, Y, TableEntry>> & { data: BottomSheetData<X, Y, TableEntry> },
    callBacks?: { dissmiss?: () => void; accept?: (result: BottomSheetResult<X, Y, TableEntry>) => void }
  );
  bottomSheet<X extends TableEntry, Y extends TableEntry, Z extends TableEntry>(
    opt: MatBottomSheetConfig<BottomSheetData<X, Y, Z>> & { data: BottomSheetData<X, Y, Z> },
    callBacks?: { dissmiss?: () => void; accept?: (result: BottomSheetResult<X, Y, Z>) => void }
  ): void {
    this.bottomSheetIsOpen.next(true);
    this._bottomSheet
      .open<BottomSheetComponent<X, Y, Z>, BottomSheetData<X, Y, Z>, BottomSheetResult<X, Y, Z>>(BottomSheetComponent, {
        autoFocus: true,
        hasBackdrop: true,
        restoreFocus: true,
        ...opt,
      })
      .afterDismissed()
      .pipe(
        first(),
        tap((result: BottomSheetResult<X, Y, Z>) => {
          switch (result?.type) {
            case BottomSheetReturnType.ACCEPTED: {
              !!callBacks?.accept && callBacks?.accept(result);
              break;
            }
            default: {
              !!callBacks?.dissmiss && callBacks.dissmiss();
              break;
            }
          }
        }),
        finalize(() => this.bottomSheetIsOpen.next(false)) // notify dialog close
      )
      .subscribe();
  }

  /**
   * Shows a dialog. The dialog can not be disabled without clicking the button.
   * Options can be changed via the opt param. Will show the heading and text of the data property.
   * Tries to call the defined callbacks after close.
   * Shows an input field if the inputLabel property of data is set.
   * @param opt The param. Data
   */
  dialog(
    opt: MatDialogConfig<DialogData> & { data: DialogData },
    callBacks?: { dismiss?: () => void; accept?: (extra?: string, path?: string) => void }
  ): void {
    // push next subject value
    this.dialogIsOpen.next(true);

    this._dialogModal
      .open<DialogComponent, DialogData, DialogResult>(DialogComponent, {
        disableClose: true,
        hasBackdrop: true,
        restoreFocus: true,
        ...opt,
        data: {
          showError: () => {
            // basic error msg if input field is empty
            this.info(this.translate.instant('DIALOG.ERROR'));
          },
          ...opt.data,
        },
      })
      .afterClosed()
      .pipe(
        first(),
        tap(result => {
          switch (result.type) {
            case DialogResultType.ACCEPTED: {
              !!callBacks && !!callBacks.accept && callBacks.accept(result.extra, result.path);
              break;
            }

            case DialogResultType.DISSMISSED: {
              !!callBacks && !!callBacks.dismiss && callBacks.dismiss();
              break;
            }

            default: {
              console.error(this.translate.instant('DIALOG.FATAL_ERROR'));
              break;
            }
          }
        }),
        finalize(() => this.dialogIsOpen.next(false)) // notify dialog close
      )
      .subscribe();
  }

  /**
   * Shows a banner. If no action is set banner hides after 2 sec. If an action and a callback is set subscribes
   * and calls callback after action click.
   * @param msg The message to show
   * @param action The action text
   * @param callback The function called on action click
   */
  info(msg: string, action?: string, callback?: () => void): void {
    const snackBar = this._snackBar.open(msg, action, {
      duration: !!action ? undefined : 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });

    if (!!action && !!callback)
      snackBar
        .onAction()
        .pipe(
          first(),
          tap(() => callback())
        )
        .subscribe();
  }
}
