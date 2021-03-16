import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'stpa',
    loadChildren: () => import('./stpa/stpa.module').then(m => m.StpaModule),
  },
  {
    path: 'stpa-old',
    loadChildren: () => import('./stpa/stpa.module').then(m => m.StpaModule),
  },
  {
    path: 'cast',
    loadChildren: () => import('./cast/cast.module').then(m => m.CastModule),
  },
  { path: '404', component: PageNotFoundComponent },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
