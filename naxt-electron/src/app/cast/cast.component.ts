import { Component } from '@angular/core';
import { AppNavigationService } from '@core/index';

@Component({
  selector: 'naxt-cast',
  templateUrl: './cast.component.html',
  styleUrls: ['./cast.component.scss'],
})
export class CastComponent {
  constructor(private readonly navigationService: AppNavigationService) {}

  get rootPath(): string {
    return this.navigationService.rootPath;
  }
}
