import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ArrowAndBoxType, CSDiaType, CSShape } from '../cs.types';
import { MessageService } from '@core/services/message/message.service';
import { AppNavigationService } from '@core/services/app-navigation/app-navigation.service';

@Component({
  selector: 'naxt-cstoolbar',
  templateUrl: './cstoolbar.component.html',
  styleUrls: ['./cstoolbar.component.scss'],
})
export class CSToolbarComponent {
  @Input() diaType: CSDiaType;
  @Output() zoomEvent: EventEmitter<any> = new EventEmitter();
  @Output() saveEvent: EventEmitter<void> = new EventEmitter();
  @Output() cancelEvent: EventEmitter<void> = new EventEmitter();

  ArrowAndBoxType = ArrowAndBoxType;
  CSShape = CSShape;

  getIconPath(icon: string): string {
    return `assets/icons/toolbar_icons/${icon}.svg`;
  }

  constructor(
    private readonly messageService: MessageService,
    private readonly navigationService: AppNavigationService
  ) {}

  get isStep2(): boolean {
    return this.diaType === CSDiaType.STEP2;
  }

  showHint(isArrow: boolean = false): void {
    if (isArrow) {
      this.messageService.info('Place Arrow somewhere!');
    } else {
      this.messageService.info('Place Box anywhere!');
    }
  }

  saveCS(): void {
    this.saveEvent.emit();
  }

  cancelCS(): void {
    this.cancelEvent.emit();
  }

  drag(ev: DragEvent, type: ArrowAndBoxType, shape: CSShape): void {
    ev.dataTransfer.setData('shape', shape);
    ev.dataTransfer.setData('type', type);
  }

  zoom(zoomIn: boolean): void {
    this.zoomEvent.emit(zoomIn);
  }
}
