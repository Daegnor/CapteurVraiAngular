import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-power',
  templateUrl: './power.component.html',
  styleUrls: ['./power.component.css']
})
export class PowerComponent implements OnInit, OnDestroy{
  id: string;
  intervalData;
  intervalGraph;

  constructor(private actRoute: ActivatedRoute, private router: Router) {
    this.id = this.actRoute.snapshot.params.id;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    $('#nomCapteur').text(this.id);
    let niveauCapteurs = {};

    getData(this.id);
    this.intervalData = setInterval(() => getData(this.id), 5000);
    getGraphData(this.id);
    this.intervalGraph = setInterval(() => getGraphData(this.id), 3600 * 1000);

    function construireGraph(values, labels): void {
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

    function getGraphData(id): void {
      $.ajax({
        url: 'http://192.168.240.129:8080/last24',
        method: 'POST',
        crossDomain: true,
        dataType: 'json',
        data: {
          capteur: id
        },
        success: (data) => {
          const values = [];
          const labels = [];
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < data.length; i++){
            values.push(data[i].val);
            labels.push(data[i].time);
          }
          construireGraph(values, labels);
        }
      });
    }

    function getData(id): void{
      // @ts-ignore
      $.ajax({
        type: 'POST',
        crossDomain: true,
        url: 'http://192.168.240.129:8080/',
        data: {
          capteur: id
        },
        success: (data) => {
          try {
            niveauCapteurs = data;
            setNiveau();
          } catch (error) {
            console.log(error);
          }
        },
        fail: (data) => {
          console.log('echec');
          console.log(data);
        }
      });
    }

    function setNiveau(): void{
      // tslint:disable-next-line:forin
      for (const key in niveauCapteurs){
        let valeur = niveauCapteurs[key];
        if (valeur === null) {
          valeur = -1;
        }
        $('#' + key).html(niveauCapteurs[key]);
      }
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalData);
    clearInterval(this.intervalGraph);
  }
}
