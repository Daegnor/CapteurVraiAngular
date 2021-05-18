import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import {AppConfig} from '../app.config';

@Component({
  selector: 'app-power',
  templateUrl: './power.component.html',
  styleUrls: ['./power.component.css']
})
/**
 * Classe PowerComponent
 * Controleur utilisé pour la route /power/:id
 * Affichage les valeurs d'un capteur Janitza identifié par son id (nom)
 */
export class PowerComponent implements OnInit, OnDestroy{
  id: string;
  intervalData;
  intervalGraph;
  niveauCapteurs;
  // IP du Raspberry inscrite dans le fichier de config
  ip = AppConfig.settings.config.ip;

  constructor(protected actRoute: ActivatedRoute, protected router: Router, protected http: HttpClient) {
    // Récupère le paramètre :id de la route
    this.id = this.actRoute.snapshot.params.id;
    // Force la réinitialisation du controleur lorsque le paramètre de la route change
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  // TODO LE GRAPH

  /**
   * Méthode récupérant les valeurs du capteur par requête HTML
   */
  getData(): void{
    this.http.post('http://' + this.ip + ':8080/', {capteur: this.id}).subscribe((data) => {
      console.log(data);
      this.niveauCapteurs = data;
      this.setNiveau();
    });
  }

  /**
   * Affiche les valeurs des capteurs sur la page
   */
  setNiveau(): void{
    // tslint:disable-next-line:forin
    for (const key in this.niveauCapteurs){
      let valeur = this.niveauCapteurs[key];
      if (valeur === null) {
        valeur = -1;
      }
      $('#' + key).html(this.niveauCapteurs[key]);
    }
  }

  /**
   * Méthode exécutant du javascript à l'ouverture de la page
   */
  ngOnInit(): void {
    // Défini le nom du capteur en bas de page
    $('#nomCapteur').text(this.id);
    // Démarre la récupération des données toutes les 10s
    this.getData();
    this.intervalData = setTimeout(() => this.getData(), 1000*10);
  }

  /**
   * Méthode exécutant du javascript lors de la fermeture de la page
   */
  ngOnDestroy(): void {
    clearInterval(this.intervalData);
  }
}
