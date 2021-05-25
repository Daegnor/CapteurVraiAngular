import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {HorlogeGraphComponent} from '../horlogeGraph/horlogeGraph.component';


@Component({
  selector: 'app-horloge',
  templateUrl: './horloge.component.html',
  styleUrls: ['./horloge.component.css']
})
/**
 * Classe HorlogeGraphComponent
 * Affiche les valeurs du capteurs à CO2/Température
 * Hérite de HorlogeGraphComponent
 */
export class HorlogeComponent extends HorlogeGraphComponent implements OnInit, OnDestroy {
  intervalAlerte = null;
  // Constante définissant le déclenchement de l'alarme
  NIVEAU_ALERTE = 1200;

  constructor(protected actRoute: ActivatedRoute, protected router: Router, protected http: HttpClient) {
    super(actRoute, router, http);
  }

  setNiveau(): void{
    super.setNiveau();

    // Initialise l'alarme si la valeur de CO2 est supérieure à NIVEAU_ALERTE, ou l'arrête si inférieur
    if (! this.niveauCapteurs.hasOwnProperty('co2')) {
      return;
    }

    const niveauCO2 = this.niveauCapteurs.co2;

    if (niveauCO2 >= this.NIVEAU_ALERTE && this.intervalAlerte === null){
      this.alerte();
      this.intervalAlerte = setInterval(this.alerte, 10000);
    }
    else if (this.intervalAlerte !== null && niveauCO2 < this.NIVEAU_ALERTE){
      clearInterval(this.intervalAlerte);
      this.intervalAlerte = null;
    }
  }

  /**
   * Méthode effectuant une alerte (passage du fond en rouge, puis de nouveau en noir au bout d'une seconde)
   */
  alerte(): void{
    $('.main_container').css('background-color', 'red');
    setTimeout(() => {
      $('.main_container').css('background-color', 'black');
    }, 1000);
  }

  getGraphData(): void {
    return;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.intervalAlerte) {
      clearInterval(this.intervalAlerte);
    }
  }
}
