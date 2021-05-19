import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {PowerComponent} from '../power/power.component';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-horloge-graph',
  templateUrl: './horlogeGraph.component.html',
  styleUrls: ['../power/power.component.css', '../horloge/horloge.component.css']
})
/**
 * Classe HorlogeGraphComponent
 * Affiche les valeurs du capteurs à CO2/Température
 * Hérite de PowerComponent
 */
export class HorlogeGraphComponent extends PowerComponent implements OnInit, OnDestroy {
  nomValeur: string;
  unite: string;

  constructor(protected actRoute: ActivatedRoute, protected router: Router, protected http: HttpClient) {
    super(actRoute, router, http);
    this.id = 'horloge';
  }

  ngOnInit(): void {
    super.ngOnInit();
    $('#nomCapteur').text('Horloge à CO2');
    this.remplacerTitres();
  }

  remplacerTitres(): void{
    $('#titreH1').html('CO<sub>2</sub> Monitor');
    $('#Wh').attr('id', 'co2');
    $('.unite').html(' PPM');
  }
}
