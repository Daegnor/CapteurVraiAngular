import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HorlogeComponent} from './horloge/horloge.component';
import {PowerComponent} from './power/power.component';

const routes: Routes = [
  { path: '', redirectTo: '/horloge', pathMatch: 'full' },
  { path: 'horloge', component: HorlogeComponent },
  { path: 'power', redirectTo: '/power/Janitza 604-PRO', pathMatch: 'full' },
  { path: 'power/:id', component: PowerComponent },
  { path: '**', redirectTo: '/horloge'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
