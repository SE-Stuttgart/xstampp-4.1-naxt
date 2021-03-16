import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'naxt-text-control',
  templateUrl: './text-control.component.html',
  styleUrls: ['./text-control.component.scss'],
})
export class TextControlComponent {
  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();
  @Input() label: string;
  @Input() notWanted: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  translationService: TranslateService;
  text: string;
  constructor(translateService: TranslateService) {
    this.translationService = translateService;
  }
  get hintedLabel(): string {
    if (this.notWanted) {
      return '';
    }
    return this.readonly ? '' : this.translationService.instant('STPA.MAXLENGTHTEXT');
  }
  onChange(newValue: string): void {
    this.valueChange.emit(newValue);
  }
}
