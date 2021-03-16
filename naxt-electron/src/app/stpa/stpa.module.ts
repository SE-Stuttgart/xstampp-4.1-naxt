import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatStepperModule } from '@angular/material/stepper';
import { StpaOverviewComponent } from './stpa-overview/stpa-overview.component';
import { StpaRoutingModule } from './stpa-routing.module';
import { StpaComponent } from './stpa.component';
import { StpaLossesComponent } from './stpa-losses/stpa-losses.component';
import { StpaSystemLevelHazardsComponent } from './stpa-system-level-hazards/stpa-system-level-hazards.component';
import { StpaSubHazardsComponent } from './stpa-sub-hazards/stpa-sub-hazards.component';
import { StpaControlStructureComponent } from './stpa-control-structure/stpa-control-structure.component';
import { StpaSystemComponentsComponent } from './stpa-system-components/stpa-system-components.component';
import { StpaInformationFlowComponent } from './stpa-information-flow/stpa-information-flow.component';
import { StpaResponsibilitiesComponent } from './stpa-responsibilities/stpa-responsibilities.component';
import { StpaControllerConstraintsComponent } from './stpa-controller-constraints/stpa-controller-constraints.component';
import { StpaProcessModelsComponent } from './stpa-process-models/stpa-process-models.component';
import { StpaProcessVariablesComponent } from './stpa-process-variables/stpa-process-variables.component';
import { StpaControlAlgorithmsComponent } from './stpa-control-algorithms/stpa-control-algorithms.component';
import { StpaConversionsComponent } from './stpa-conversions/stpa-conversions.component';
import { StpaLossScenariosComponent } from './stpa-loss-scenarios/stpa-loss-scenarios.component';
import { StpaImplementationConstraintsComponent } from './stpa-implementation-constraints/stpa-implementation-constraints.component';
import { StpaSystemLevelSafetyConstraintsComponent } from './stpa-system-level-safety-constraints/stpa-system-level-safety-constraints.component';
import { StpaUcaComponent } from './stpa-uca/stpa-uca.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { StpaFailuresComponent } from './stpa-loss-scenarios/stpa-failures/stpa-failures.component';
import { StpaInadequateCaComponent } from './stpa-loss-scenarios/stpa-inadequate-ca/stpa-inadequate-ca.component';
import { StpaUnsafeCiComponent } from './stpa-loss-scenarios/stpa-unsafe-ci/stpa-unsafe-ci.component';
import { StpaInadequatePmComponent } from './stpa-loss-scenarios/stpa-inadequate-pm/stpa-inadequate-pm.component';
import { StpaUcaRefinementComponent } from './stpa-uca-refinement/stpa-uca-refinement.component';
import { StpaSubSafetyConstraintComponent } from './stpa-sub-safety-constraint/stpa-sub-safety-constraint.component';
import { CanDeactivateCS } from './CanDeactivateCS';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    StpaOverviewComponent,
    StpaComponent,
    StpaLossesComponent,
    StpaSystemLevelHazardsComponent,
    StpaSubHazardsComponent,
    StpaControlStructureComponent,
    StpaSystemComponentsComponent,
    StpaInformationFlowComponent,
    StpaResponsibilitiesComponent,
    StpaControllerConstraintsComponent,
    StpaProcessModelsComponent,
    StpaProcessVariablesComponent,
    StpaControlAlgorithmsComponent,
    StpaConversionsComponent,
    StpaLossScenariosComponent,
    StpaImplementationConstraintsComponent,
    StpaSystemLevelSafetyConstraintsComponent,
    StpaUcaComponent,
    StpaFailuresComponent,
    StpaInadequateCaComponent,
    StpaUnsafeCiComponent,
    StpaInadequatePmComponent,
    StpaUcaRefinementComponent,
    StpaSubSafetyConstraintComponent,
  ],
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    CommonModule,
    SharedModule,
    StpaRoutingModule,
    TranslateModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressButtonsModule,
    MatTooltipModule,
  ],
  providers: [CanDeactivateCS],
})
export class StpaModule {}
