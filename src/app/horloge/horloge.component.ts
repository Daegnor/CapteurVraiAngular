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
 * Hérite de PowerComponent
 */
export class HorlogeComponent extends HorlogeGraphComponent implements OnInit, OnDestroy {
  intervalAlerte;
  MAX = 3000;
  NIVEAU_ALERTE = 1200;

  constructor(protected actRoute: ActivatedRoute, protected router: Router, protected http: HttpClient) {
    super(actRoute, router, http);
  }

  setNiveau(): void{
    super.setNiveau();

    // Initialise l'alarme si la valeur de CO2 est supérieure à NIVEAU_ALERTE
    if (! this.niveauCapteurs.hasOwnProperty('co2')) {
      return;
    }
    // @ts-ignore
    let niveauCO2 = this.niveauCapteurs.co2;

    if (niveauCO2 > this.MAX) {
      niveauCO2 = this.MAX;
    }

    const nbChild = niveauCO2 / (this.MAX / 10) + 1;
    this.clearRect();

    for (let i = 0; i <= nbChild; i++) {
      $($('#barres').children()[$('#barres').children().length - i]).addClass('rectActif');
    }

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
    $('body').css('background-color', 'red');
    setTimeout(() => {
      $('body').css('background-color', 'black');
    }, 1000);
  }

  /**
   * Méthode réinitialisant les rectangles à coté des smileys
   */
  clearRect(): void{
    $('.rectActif').each(() => {
      $(this).removeClass('rectActif');
    });
  }

  getGraphData(): void {
    return;
  }

  ngOnInit(): void {
    super.ngOnInit();
    clearInterval(this.intervalGraph);
  }

  remplacerTitres(): void{
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.intervalAlerte) {
      clearInterval(this.intervalAlerte);
    }
  }
}
