import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Duration } from '@src-shared/Enums';

@Component({
  selector: 'naxt-recommondations-button-group',
  templateUrl: './recommondations-button-group.component.html',
  styleUrls: ['./recommondations-button-group.component.scss'],
})
export class RecommondationsButtonGroupComponent {
  @Input() value: Duration = Duration.EXTENSIVE;
  @Output() valueChange: EventEmitter<Duration> = new EventEmitter<Duration>();
  States: Array<Duration> = [Duration.IMMIDIATELY, Duration.LONGTERM, Duration.EXTENSIVE];
  @Input() longterm: boolean = false;
  @Input() extensive: boolean = false;

  onChange(value: Duration): void {
    this.valueChange.emit(value);
  }
}
