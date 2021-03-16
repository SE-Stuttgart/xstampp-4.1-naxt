import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'naxt-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
})
export class ButtonGroupComponent {
  @Input() value: string;
  @Input() toggleOptions: Array<string>;
  @Output() valueChange = new EventEmitter<string>();

  onChange(newValue: string): void {
    this.valueChange.emit(newValue);
  }
}
