import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LinkedDocuments } from '@src-shared/Interfaces';

@Component({
  selector: 'naxt-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent implements OnInit {
  editable: boolean = false;
  @Input() linkedDokumentView = true;
  @Input() content: string;
  @Output() contentChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() saveEmit: EventEmitter<void> = new EventEmitter<void>();

  @Input() linkedDokumentList: LinkedDocuments[];
  @Output() linkedDokumentListChange: EventEmitter<LinkedDocuments[]> = new EventEmitter<LinkedDocuments[]>();

  private _savedContent: string = '';
  set savedContent(v: string) {
    this._savedContent = v;
  }

  get savedContent(): string {
    return this._savedContent;
  }

  ngOnInit(): void {
    if (!!this.content) this.savedContent = this.content;
  }

  onEdit(): void {
    this.editable = true;
  }

  onCancel(): void {
    this.editable = false;
    this.content = this.savedContent;
  }

  onSave(): void {
    this.editable = false;
    this.savedContent = this.content;
    this.contentChange.emit(this.savedContent);
    this.saveEmit.emit();
  }
}
