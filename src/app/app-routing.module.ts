import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HorlogeComponent} from './horloge/horloge.component';
import {PowerComponent} from './power/power.component';
import {HorlogeGraphComponent} from './horlogeGraph/horlogeGraph.component';

const routes: Routes = [
  // Chemin par défaut ("/")
  { path: '', component: HorlogeComponent, pathMatch: 'full' },
  { path: 'horloge', component: HorlogeComponent },
  { path: 'horloge/graph', component: HorlogeGraphComponent },
  // Si on ne précise pas de capteur, redirige vers Janitza 604
  { path: 'power', redirectTo: '/power/Janitza 604', pathMatch: 'full' },
  { path: 'power/:id', component: PowerComponent },
  // Si on utilise une route nom définie, redirige vers /
  { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
