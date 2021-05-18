import {Component, OnDestroy, OnInit} from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AppConfig} from '../app.config';


@Component({
  selector: 'app-horloge',
  templateUrl: './horloge.component.html',
  styleUrls: ['./horloge.component.css']
})
export class HorlogeComponent implements OnInit, OnDestroy {
  intervalData;
  intervalAlerte;
  niveauCapteurs;
  MAX = 3000;
  NIVEAU_ALERTE = 1200;
  ip = AppConfig.settings.config.ip;

  constructor(private http: HttpClient) {}

  getData(): void{

    this.http.post('http://' + this.ip + ':8080/', {capteur: 'horloge'}).subscribe((data) => {
      console.log(data);
      this.niveauCapteurs = data;
      this.setNiveau();
    });
  }

  setNiveau(): void{
    // tslint:disable-next-line:forin
    for (const key in this.niveauCapteurs){
      let valeur = this.niveauCapteurs[key];
      if (valeur === null) {
        valeur = -1;
      }
      $('#' + key).html(this.niveauCapteurs[key]);
    }


    if (! this.niveauCapteurs.hasOwnProperty('co2')) {
      return;
    }
    // @ts-ignore
    let niveauCO2 = niveauCapteurs.co2;

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

  alerte(): void{
    $('body').css('background-color', 'red');
    setTimeout(() => {
      $('body').css('background-color', 'black');
    }, 1000);
  }

  clearRect(): void{
    $('.rectActif').each(() => {
      $(this).removeClass('rectActif');
    });
  }

  ngOnInit(): void {
    $('#nomCapteur').text('Horloge a CO2');
    this.getData();
    this.intervalData = setTimeout(() => this.getData(), 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalData);
    if (this.intervalAlerte) {
      clearInterval(this.intervalAlerte);
    }
  }
}
