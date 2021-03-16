import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CastComponent } from './cast.component';
import { CastOverviewComponent } from './cast-overview/cast-overview.component';
import { CastAccidentDescriptionComponent } from './cast-accident-description/cast-accident-description.component';
import { CastConstraintComponent } from './cast-constraint/cast-constraint.component';
import { CastHazardComponent } from './cast-hazard/cast-hazard.component';
import { CastEventComponent } from './cast-event/cast-event.component';
import { CastResponsibilitiesComponent } from './cast-responsibilities/cast-responsibilities.component';
import { CastSystemComponentsComponent } from './cast-system-components/cast-system-components.component';
import { CastInformationFlowComponent } from './cast-information-flow/cast-information-flow.component';
import { CastRoleInTheAccidentComponent } from './cast-role-in-the-accident/cast-role-in-the-accident.component';
import { CastCommunicationAndCoordinationComponent } from './cast-communication-and-coordination/cast-communication-and-coordination.component';
import { CastSafetyInformationSystemComponent } from './cast-safety-information-system/cast-safety-information-system.component';
import { CastSafetyManagementSystemComponent } from './cast-safety-management-system/cast-safety-management-system.component';
import { CastSafetyCultureComponent } from './cast-safety-culture/cast-safety-culture.component';
import { CastChangesAndDynamicsComponent } from './cast-changes-and-dynamics/cast-changes-and-dynamics.component';
import { CastInternalAndExternalEconomicsComponent } from './cast-internal-and-external-economics/cast-internal-and-external-economics.component';
import { CastStep4OthersComponent } from './cast-step4-others/cast-step4-others.component';
import { CastSubRecommondationsComponent } from './cast-sub-recommondations/cast-sub-recommondations.component';
import { CastRecommendationsComponent } from './cast-recommendations/cast-recommendations.component';
import { CastQuestionAndAnswerComponent } from './cast-question-and-answer/cast-question-and-answer.component';
import { CastControlStructureComponent } from './cast-control-structure/cast-control-structure.component';
import { CanDeactivateCS } from './CanDeactivateCS';

const routes: Routes = [
  {
    path: ':id',
    component: CastComponent,
    children: [
      {
        path: 'overview',
        component: CastOverviewComponent,
      },
      {
        path: 'accident-description',
        component: CastAccidentDescriptionComponent,
      },
      {
        path: 'constraints',
        component: CastConstraintComponent,
      },
      {
        path: 'hazards',
        component: CastHazardComponent,
      },
      {
        path: 'events',
        component: CastEventComponent,
      },
      {
        path: 'system-components',
        component: CastSystemComponentsComponent,
      },
      {
        path: 'control-structure',
        component: CastControlStructureComponent,
        canDeactivate: [CanDeactivateCS],
      },
      {
        path: 'information-flow',
        component: CastInformationFlowComponent,
      },
      {
        path: 'responsibilities',
        component: CastResponsibilitiesComponent,
      },
      {
        path: 'role-in-the-accident',
        component: CastRoleInTheAccidentComponent,
      },
      {
        path: 'communication-and-coordination',
        component: CastCommunicationAndCoordinationComponent,
      },
      {
        path: 'safety-information-system',
        component: CastSafetyInformationSystemComponent,
      },
      {
        path: 'safety-managment-system',
        component: CastSafetyManagementSystemComponent,
      },
      {
        path: 'safety-culture',
        component: CastSafetyCultureComponent,
      },
      {
        path: 'changes-and-dynamics-over-time',
        component: CastChangesAndDynamicsComponent,
      },
      {
        path: 'internal-and-external-economic-and-related-factors',
        component: CastInternalAndExternalEconomicsComponent,
      },
      {
        path: 'others',
        component: CastStep4OthersComponent,
      },
      {
        path: 'recommondations',
        component: CastRecommendationsComponent,
      },
      {
        path: 'sub-recommondations',
        component: CastSubRecommondationsComponent,
      },
      {
        path: 'questions-and-answers',
        component: CastQuestionAndAnswerComponent,
      },
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CastRoutingModule {}
