import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HorlogeComponent} from './horloge/horloge.component';
import {PowerComponent} from './power/power.component';
import {HorlogeGraphComponent} from './horlogeGraph/horlogeGraph.component';

const routes: Routes = [
  { path: '', component: HorlogeComponent, pathMatch: 'full' },
  { path: 'horloge', component: HorlogeComponent },
  { path: 'horloge/graph', component: HorlogeGraphComponent },
  { path: 'power', redirectTo: '/power/Janitza 604-PRO', pathMatch: 'full' },
  { path: 'power/:id', component: PowerComponent },
  { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
