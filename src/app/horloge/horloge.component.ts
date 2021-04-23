import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-horloge',
  templateUrl: './horloge.component.html',
  styleUrls: ['./horloge.component.css']
})
export class HorlogeComponent implements OnInit, OnDestroy {
  intervalData;
  intervalAlerte;

  constructor() {}

  ngOnInit(): void {
    $('#nomCapteur').text('Horloge a CO2');
    $('#lien_horloge').addClass('active');
    const MAX = 3000;
    const NIVEAU_ALERTE = 1200;
    let niveauCapteurs = {};
    let interval = null;

    getData();
    this.intervalData = setTimeout(getData, 5000);

    function getData(): void{
      // @ts-ignore
      $.ajax({
        type: 'POST',
        crossDomain: true,
        url: 'http://192.168.240.129:8080/',
        data: {
          capteur: 'horloge'
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


      if (! niveauCapteurs.hasOwnProperty('co2')) {
        return;
      }
      // @ts-ignore
      let niveauCO2 = niveauCapteurs.co2;

      if (niveauCO2 > MAX) {
        niveauCO2 = MAX;
      }

      const nbChild = niveauCO2 / (MAX / 10) + 1;
      clearRect();

      for (let i = 0; i <= nbChild; i++) {
        $($('#barres').children()[$('#barres').children().length - i]).addClass('rectActif');
      }

      if (niveauCO2 >= NIVEAU_ALERTE && interval === null){
        alerte();
        interval = setInterval(alerte, 10000);
      }
      else if (interval !== null && niveauCO2 < NIVEAU_ALERTE){
        clearInterval(interval);
        interval = null;
      }
    }

    function alerte(): void{
      $('body').css('background-color', 'red');
      setTimeout(() => {
        $('body').css('background-color', 'black');
      }, 1000);
    }

    function clearRect(): void{
      $('.rectActif').each(() => {
        $(this).removeClass('rectActif');
      });
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalData);
    if (this.intervalAlerte) {
      clearInterval(this.intervalAlerte);
    }
  }
}
