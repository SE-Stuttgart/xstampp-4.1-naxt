import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'naxt-checkbox-control',
  templateUrl: './checkbox-control.component.html',
  styleUrls: ['./checkbox-control.component.scss'],
})
export class CheckboxControlComponent {
  @Input() value: boolean;
  @Output() valueChange = new EventEmitter<boolean>();
  @Input() label: string;

  onChange(newValue: boolean): void {
    this.valueChange.emit(newValue);
  }
}
