import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { TranslateService } from '@ngx-translate/core';
import { BottomSheetData, BottomSheetResult, BottomSheetReturnType } from './bottomSheet.types';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TableEntry } from '@src-shared/Interfaces';

@Component({
  selector: 'naxt-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss'],
})
export class BottomSheetComponent<X extends TableEntry, Y extends TableEntry, Z extends TableEntry> implements OnInit {
  data: BottomSheetData<X, Y, Z>;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) data: BottomSheetData<X, Y, Z>,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetComponent<X, Y, Z>, BottomSheetResult<X, Y, Z>>,
    private readonly translate: TranslateService,
    private readonly _formBuilder: FormBuilder
  ) {
    this.data = data;
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
  }

  dismiss(): void {
    this._bottomSheetRef.dismiss({ type: BottomSheetReturnType.DISSMISSED });
  }

  accept(): void {
    this._bottomSheetRef.dismiss({
      type: BottomSheetReturnType.ACCEPTED,
      selected1: this.data?.liste1?.find(ele => ele.tableId === this.thirdFormGroup?.get('firstCtrl')?.value),
      selected2: this.data?.liste2?.find(ele => ele.tableId === this.secondFormGroup?.get('firstCtrl')?.value),
      selected3: this.data?.liste3?.find(ele => ele.tableId === this.firstFormGroup?.get('firstCtrl')?.value),
    });
  }
}
