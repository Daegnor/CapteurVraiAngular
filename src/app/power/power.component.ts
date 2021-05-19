import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConfig} from '../app.config';
import { map } from 'rxjs/operators';

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
  protected id: string;
  protected intervalData;
  protected intervalGraph;
  protected niveauCapteurs;
  // IP du Raspberry inscrite dans le fichier de config
  protected ip = AppConfig.settings.config.ip;

  constructor(protected actRoute: ActivatedRoute, protected router: Router, protected http: HttpClient) {
    // Récupère le paramètre :id de la route
    this.id = this.actRoute.snapshot.params.id;
    // Force la réinitialisation du controleur lorsque le paramètre de la route change
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  /**
   * Méthode récupérant les valeurs du capteur par requête HTML
   * Passe par du JsonP pour éviter les problèmes de cross-origin
   */
  getData(): void{
    this.http.jsonp('https://' + this.ip + '/Ajax/GetValues?capteur=' + this.id, 'callback').pipe(map(data => {
      console.log(data);
      this.niveauCapteurs = data;
      this.setNiveau();
    })).subscribe(data => {});
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

  construireGraph(values, labels): void {
    const c = $('#graph');
    const ctx = (c.get(0) as HTMLCanvasElement).getContext('2d');
    // @ts-ignore
    // tslint:disable-next-line:no-unused-expression
    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Wh',
          data: values,
          fill: false,
          borderColor: '#00A000',
          pointHoverBorderColor: '#A00000'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio : false,
        legend: {
          labels: {
            fontColor: 'white'
          }
        },
        scales: {
          yAxes: [{
            gridLines: {
              color: '#505050'
            },
            ticks: {
              fontColor: 'white',
              beginAtZero: true
            }
          }],
          xAxes: [{
            gridLines: {
              color: '#505050'
            },
            ticks: {
              fontColor: 'white'
            }
          }]
        }
      }
    });
  }

  getGraphData(): void {
    this.http.jsonp('https://' + this.ip + '/Ajax/Last24?capteur=' + this.id + '&nomValeur=co2', 'callback').pipe(map(data => {
      console.log(data);
      const values = [];
      const labels = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = Object.keys(data).length - 1; i >= 0; i--){
        values.push(data[i].value);
        labels.push(data[i].time + ':00');
      }
      this.construireGraph(values, labels);
    })).subscribe(data => {});
  }

  /**
   * Méthode exécutant du javascript à l'ouverture de la page
   */
  ngOnInit(): void {
    // Défini le nom du capteur en bas de page
    $('#nomCapteur').text(this.id);
    // Démarre la récupération des données toutes les 10s
    this.getData();
    this.intervalData = setTimeout(() => this.getData(), 1000 * 10);
    this.getGraphData();
    this.intervalGraph = setInterval(() => this.getGraphData(), 3600 * 1000);
  }

  /**
   * Méthode exécutant du javascript lors de la fermeture de la page
   */
  ngOnDestroy(): void {
    clearInterval(this.intervalData);
  }
}
