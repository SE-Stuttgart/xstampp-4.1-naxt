import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastSystemComponentsComponent } from './cast-system-components.component';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { AppNavigationService } from '@core/index';
import { RouterTestingModule } from '@angular/router/testing';
import { TableComponent, SharedModule } from '@shared/index';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CastSystemComponentsComponent', () => {
  let component: CastSystemComponentsComponent;
  let fixture: ComponentFixture<CastSystemComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastSystemComponentsComponent, TableComponent], // TableCompnent used in ViewChild
      providers: [AppNavigationService],
      imports: [
        // import subcomponents (shared module) and animations (normaly imported in core module)
        BrowserAnimationsModule,
        SharedModule,
        // needed for AppNavigationService
        RouterTestingModule,
        // needed for translation service
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastSystemComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
