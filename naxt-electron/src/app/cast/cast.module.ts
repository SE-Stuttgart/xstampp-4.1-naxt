import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { CastAccidentDescriptionComponent } from './cast-accident-description/cast-accident-description.component';
import { CastChangesAndDynamicsComponent } from './cast-changes-and-dynamics/cast-changes-and-dynamics.component';
import { CastCommunicationAndCoordinationComponent } from './cast-communication-and-coordination/cast-communication-and-coordination.component';
import { CastConstraintComponent } from './cast-constraint/cast-constraint.component';
import { CastEventComponent } from './cast-event/cast-event.component';
import { CastHazardComponent } from './cast-hazard/cast-hazard.component';
import { CastInformationFlowComponent } from './cast-information-flow/cast-information-flow.component';
import { CastInternalAndExternalEconomicsComponent } from './cast-internal-and-external-economics/cast-internal-and-external-economics.component';
import { CastOverviewComponent } from './cast-overview/cast-overview.component';
import { CastQuestionAndAnswerComponent } from './cast-question-and-answer/cast-question-and-answer.component';
import { CastRecommendationsComponent } from './cast-recommendations/cast-recommendations.component';
import { CastResponsibilitiesComponent } from './cast-responsibilities/cast-responsibilities.component';
import { CastRoleInTheAccidentComponent } from './cast-role-in-the-accident/cast-role-in-the-accident.component';
import { CastRoutingModule } from './cast-routing.module';
import { CastSafetyCultureComponent } from './cast-safety-culture/cast-safety-culture.component';
import { CastSafetyInformationSystemComponent } from './cast-safety-information-system/cast-safety-information-system.component';
import { CastSafetyManagementSystemComponent } from './cast-safety-management-system/cast-safety-management-system.component';
import { CastStep4OthersComponent } from './cast-step4-others/cast-step4-others.component';
import { CastSubRecommondationsComponent } from './cast-sub-recommondations/cast-sub-recommondations.component';
import { CastSystemComponentsComponent } from './cast-system-components/cast-system-components.component';
import { CastComponent } from './cast.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CastControlStructureComponent } from './cast-control-structure/cast-control-structure.component';
import { CanDeactivateCS } from './CanDeactivateCS';

@NgModule({
  declarations: [
    CastComponent,
    CastOverviewComponent,
    CastAccidentDescriptionComponent,
    CastConstraintComponent,
    CastHazardComponent,
    CastEventComponent,
    CastResponsibilitiesComponent,
    CastSystemComponentsComponent,
    CastInformationFlowComponent,
    CastRoleInTheAccidentComponent,
    CastCommunicationAndCoordinationComponent,
    CastSafetyInformationSystemComponent,
    CastSafetyManagementSystemComponent,
    CastSafetyCultureComponent,
    CastChangesAndDynamicsComponent,
    CastInternalAndExternalEconomicsComponent,
    CastStep4OthersComponent,
    CastSubRecommondationsComponent,
    CastRecommendationsComponent,
    CastQuestionAndAnswerComponent,
    CastControlStructureComponent,
  ],
  imports: [
    CommonModule,
    CastRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatExpansionModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    SharedModule,
    TranslateModule,
  ],
  providers: [CanDeactivateCS],
})
export class CastModule {}
