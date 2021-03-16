import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectronService, AppNavigationService, ProjectService } from './services';
import { MessageService } from './services/message/message.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatSnackBarModule, TranslateModule, MatButtonModule, SharedModule],
  providers: [ElectronService, AppNavigationService, ProjectService, MessageService],
  exports: [],
})
export class CoreModule {}
