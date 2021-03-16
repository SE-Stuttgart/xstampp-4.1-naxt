import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StpaOverviewComponent } from './stpa-overview/stpa-overview.component';
import { StpaComponent } from './stpa.component';
import { StpaLossesComponent } from './stpa-losses/stpa-losses.component';
import { StpaSystemLevelHazardsComponent } from './stpa-system-level-hazards/stpa-system-level-hazards.component';
import { StpaSystemLevelSafetyConstraintsComponent } from './stpa-system-level-safety-constraints/stpa-system-level-safety-constraints.component';
import { StpaSubHazardsComponent } from './stpa-sub-hazards/stpa-sub-hazards.component';
import { StpaControlStructureComponent } from './stpa-control-structure/stpa-control-structure.component';
import { StpaSystemComponentsComponent } from './stpa-system-components/stpa-system-components.component';
import { StpaInformationFlowComponent } from './stpa-information-flow/stpa-information-flow.component';
import { StpaResponsibilitiesComponent } from './stpa-responsibilities/stpa-responsibilities.component';
import { StpaUcaComponent } from './stpa-uca/stpa-uca.component';
import { StpaControllerConstraintsComponent } from './stpa-controller-constraints/stpa-controller-constraints.component';
import { StpaProcessModelsComponent } from './stpa-process-models/stpa-process-models.component';
import { StpaProcessVariablesComponent } from './stpa-process-variables/stpa-process-variables.component';
import { StpaControlAlgorithmsComponent } from './stpa-control-algorithms/stpa-control-algorithms.component';
import { StpaConversionsComponent } from './stpa-conversions/stpa-conversions.component';
import { StpaLossScenariosComponent } from './stpa-loss-scenarios/stpa-loss-scenarios.component';
import { StpaImplementationConstraintsComponent } from './stpa-implementation-constraints/stpa-implementation-constraints.component';
import { StpaUcaRefinementComponent } from './stpa-uca-refinement/stpa-uca-refinement.component';
import { StpaSubSafetyConstraintComponent } from './stpa-sub-safety-constraint/stpa-sub-safety-constraint.component';
import { CanDeactivateCS } from './CanDeactivateCS';

const routes: Routes = [
  {
    path: ':id',
    component: StpaComponent,
    children: [
      {
        path: 'overview',
        component: StpaOverviewComponent,
      },
      {
        path: 'losses',
        component: StpaLossesComponent,
      },
      {
        path: 'system-level-hazards',
        component: StpaSystemLevelHazardsComponent,
      },
      {
        path: 'sub-hazards',
        component: StpaSubHazardsComponent,
      },
      {
        path: 'system-level-safety-constraint',
        component: StpaSystemLevelSafetyConstraintsComponent,
      },
      {
        path: 'sub-safety-constraint',
        component: StpaSubSafetyConstraintComponent,
      },
      {
        path: 'control-structure',
        component: StpaControlStructureComponent,
        canDeactivate: [CanDeactivateCS],
      },
      {
        path: 'control-structure1',
        component: StpaControlStructureComponent,
        canDeactivate: [CanDeactivateCS],
      },
      {
        path: 'system-components',
        component: StpaSystemComponentsComponent,
      },
      {
        path: 'information-flow',
        component: StpaInformationFlowComponent,
      },
      {
        path: 'responsibilities',
        component: StpaResponsibilitiesComponent,
      },
      {
        path: 'uca',
        component: StpaUcaComponent,
      },
      {
        path: 'controller-constraint',
        component: StpaControllerConstraintsComponent,
      },
      {
        path: 'process-models',
        component: StpaProcessModelsComponent,
      },
      {
        path: 'process-variables',
        component: StpaProcessVariablesComponent,
      },
      {
        path: 'uca-refinement',
        component: StpaUcaRefinementComponent,
      },
      {
        path: 'control-algorithms',
        component: StpaControlAlgorithmsComponent,
      },
      {
        path: 'conversions',
        component: StpaConversionsComponent,
      },
      {
        path: 'loss-scenarios',
        component: StpaLossScenariosComponent,
      },
      {
        path: 'implementation-constraints',
        component: StpaImplementationConstraintsComponent,
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
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StpaRoutingModule {}
