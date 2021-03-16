import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
import {
  BottomSheetComponent,
  ControlStructureComponent,
  CSContextMenuComponent,
  CSToolbarComponent,
  DialogComponent,
  FilterComponent,
  PageNotFoundComponent,
  TableComponent,
  TextEditorComponent,
} from './components';
import {
  ButtonGroupComponent,
  CheckboxControlComponent,
  ChipControllerComponent,
  ChipCreateComponent,
  DropdownControlComponent,
  MultiLineTextComponent,
  StatesButtonGroupComponent,
  TextControlComponent,
} from './controls';
import { TabDirective, WebviewDirective } from './directives';
import { LinkedDokumentsComponent } from './controls/linked-dokuments/linked-dokuments.component';
import { DialogLinkedDocumentsComponent } from './controls/linked-dokuments/dialog-linked-documents/dialog-linked-documents.component';
import { QuestionControlComponent } from './controls/question-control/question-control.component';
import { RecommondationsButtonGroupComponent } from './controls/recommondations-button-group/recommondations-button-group.component';
import { MentionModule } from 'angular-mentions';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const components = [
  PageNotFoundComponent,
  WebviewDirective,
  TabDirective,
  TableComponent,
  CheckboxControlComponent,
  TextControlComponent,
  FilterComponent,
  DropdownControlComponent,
  ChipControllerComponent,
  MultiLineTextComponent,
  ButtonGroupComponent,
  StatesButtonGroupComponent,
  DialogComponent,
  TextEditorComponent,
  LinkedDokumentsComponent,
  DialogLinkedDocumentsComponent,
  QuestionControlComponent,
  RecommondationsButtonGroupComponent,
  ControlStructureComponent,
  CSToolbarComponent,
  CSContextMenuComponent,
  BottomSheetComponent,
  ChipCreateComponent,
];
@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatChipsModule,
    MatSelectModule,
    MatSidenavModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatBottomSheetModule,
    MatMenuModule,
    MatListModule,
    FormsModule,
    MatSortModule,
    MatGridListModule,
    MatTabsModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatSidenavModule,
    MatStepperModule,
    CdkTableModule,
    MentionModule,
    QuillModule.forRoot(),
    MatTooltipModule,
  ],
  exports: [...components],
})
export class SharedModule {}
