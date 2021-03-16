export interface DialogData {
  headline: string;
  text: string;

  printObjects?: string[];

  inputLabel?: string;
  showError?: () => void;
  dismissButtonText?: string;
  acceptButtonText?: string;
  labelDirectoryPathField?: string;
}

export interface DialogResult {
  type: DialogResultType;
  extra?: string;
  path?: string;
}

export enum DialogResultType {
  ACCEPTED = 'ACCEPTED',
  DISSMISSED = 'DISSMISSED',
}
