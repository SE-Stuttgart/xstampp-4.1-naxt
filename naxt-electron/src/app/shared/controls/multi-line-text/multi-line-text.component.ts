import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import 'quill-mention';
import { QuillEditorComponent, QuillModules } from 'ngx-quill';

@Component({
  selector: 'naxt-multi-line-text',
  templateUrl: './multi-line-text.component.html',
  styleUrls: ['./multi-line-text.component.scss'],
})
export class MultiLineTextComponent {
  @Input() label: string;
  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();
  @Input() maxRows: number;
  @Input() readonlyTextArea: boolean = false;
  @Input() editorConfigs: EditorConfig[];

  @ViewChild(QuillEditorComponent) editor: QuillEditorComponent;

  getValues(denotationChar: string): { value: string; insert?: string }[] {
    return this.editorConfigs?.find(ele => ele.key == denotationChar)?.list ?? [];
  }

  modules: QuillModules = {
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖÜåäöü]*$/,
      mentionDenotationChars: ['@', '#', '$', '§'],
      spaceAfterInsert: false,
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      onSelect: (item, insertItem) => {
        const editor = this.editor.quillEditor;
        insertItem({
          ...item,
          value: this.getValues(item.denotationChar)?.find(ele => ele.value === item?.value)?.insert ?? item.value,
        });
        // necessary because quill-mention triggers changes as 'api' instead of 'user'
        editor.insertText(editor.getLength() - 1, '', 'user');
      },
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      source: (searchTerm, renderList, mentionChar) => {
        if (searchTerm.length === 0) {
          renderList(this.getValues(mentionChar), searchTerm);
        } else {
          const matches = [];

          this.getValues(mentionChar).forEach(entry => {
            if (entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
              matches.push(entry);
            }
          });
          renderList(matches, searchTerm);
        }
      },
    },
    toolbar: false,
  };

  onChange(newValue: string): void {
    this.valueChange.emit(newValue);
  }
}

export class EditorConfig {
  key: '@' | '#' | '$' | '§';
  // onSelect: (item, insertItem) => void;
  list: { value: string; insert?: string }[];
}
