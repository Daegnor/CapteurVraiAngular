import {Component, forwardRef, OnDestroy, OnInit, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {PowerComponent} from '../power/power.component';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-horloge-graph',
  templateUrl: './horlogeGraph.component.html',
  providers: [{provide: PowerComponent, useExisting: forwardRef(() => HorlogeGraphComponent)}],
  styleUrls: ['../power/power.component.css', '../horloge/horloge.component.css']
})
/**
 * Classe HorlogeGraphComponent
 * Affiche les valeurs du capteurs à CO2/Température
 * Hérite de PowerComponent
 */
export class HorlogeGraphComponent extends PowerComponent implements OnInit, OnDestroy {
  constructor(protected actRoute: ActivatedRoute, protected router: Router, protected http: HttpClient) {
    super(actRoute, router, http);
    this.id = 'horloge';
    this.unite = 'PPM';
    this.nomValeur = 'co2';
    this.beginAtZero = true;
  }

  ngOnInit(): void {
    super.ngOnInit();
    $('#nomCapteur').text('Horloge à CO2');
  }
}
