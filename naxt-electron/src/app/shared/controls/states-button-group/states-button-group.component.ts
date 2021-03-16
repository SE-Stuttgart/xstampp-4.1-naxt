import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'naxt-states-button-group',
  templateUrl: './states-button-group.component.html',
  styleUrls: ['./states-button-group.component.scss'],
})
export class StatesButtonGroupComponent {
  @Input() value: string = 'TODO';
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  States: Array<string> = ['TODO', 'DOING', 'DONE'];

  onChange(newValue: string): void {
    this.valueChange.emit(newValue);
  }
}
