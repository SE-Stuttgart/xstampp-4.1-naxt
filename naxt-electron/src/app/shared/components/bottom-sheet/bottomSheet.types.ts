import { TableEntry } from '@src-shared/Interfaces';

export interface BottomSheetData<X extends TableEntry, Y extends TableEntry, Z extends TableEntry> {
  headline: string;
  headline1?: string;
  headline2?: string;
  headline3?: string;
  liste1?: X[];
  liste2?: Y[];
  liste3?: Z[];
}

export interface BottomSheetResult<X extends TableEntry, Y extends TableEntry, Z extends TableEntry> {
  type: BottomSheetReturnType;
  selected1?: X;
  selected2?: Y;
  selected3?: Z;
}

export enum BottomSheetReturnType {
  ACCEPTED = 'ACCEPTED',
  DISSMISSED = 'DISSMISSED',
}
