import {Component, DoCheck, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-power',
  templateUrl: './power.component.html',
  styleUrls: ['./power.component.css']
})
export class PowerComponent implements OnInit, OnDestroy{
  id: string;
  intervalData;

  constructor(private actRoute: ActivatedRoute, private router: Router) {
    this.id = this.actRoute.snapshot.params.id;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    $('#nomCapteur').text(this.id);
    $('#lien_' + this.id.replace(' ', '')).addClass('active');
    let niveauCapteurs = {};

    getData(this.id);
    this.intervalData = setInterval(() => getData(this.id), 5000);

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
  }
}
