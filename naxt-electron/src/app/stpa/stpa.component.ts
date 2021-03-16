import { Component } from '@angular/core';
import { AppNavigationService } from '@core/index';

@Component({
  selector: 'naxt-stpa',
  templateUrl: './stpa.component.html',
  styleUrls: ['./stpa.component.scss'],
})
export class StpaComponent {
  constructor(private readonly navigationService: AppNavigationService) {}

  get rootPath(): string {
    return this.navigationService.rootPath;
  }

  isActive(path: string): boolean {
    return this.navigationService.subIsActive(path);
  }
}
