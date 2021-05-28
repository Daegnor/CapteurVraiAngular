import {Component, forwardRef, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
 * Affiche les valeurs du capteurs à CO2 ainsi que son évolution sur le temps
 * Hérite de PowerComponent
 */
export class HorlogeGraphComponent extends PowerComponent implements OnInit, OnDestroy {
	intervalAlerte = null;
	// Constante définissant le déclenchement de l'alarme
	NIVEAU_ALERTE = 800;

	constructor(protected actRoute: ActivatedRoute, protected router: Router, protected http: HttpClient) {
		super(actRoute, router, http);
		this.id = 'horloge';
		this.unite = 'PPM';
		this.nomValeur = 'co2';
		this.beginAtZero = true;
	}

	setNiveau(): void {
		super.setNiveau();

		// Initialise l'alarme si la valeur de CO2 est supérieure à NIVEAU_ALERTE, ou l'arrête si inférieur
		if (!this.niveauCapteurs.hasOwnProperty('co2')) {
			return;
		}

		const niveauCO2 = this.niveauCapteurs.co2;

		if (niveauCO2 >= this.NIVEAU_ALERTE && this.intervalAlerte === null) {
			this.alerte();
			this.intervalAlerte = setInterval(this.alerte, 10000);
		} else if (this.intervalAlerte !== null && niveauCO2 < this.NIVEAU_ALERTE) {
			clearInterval(this.intervalAlerte);
			this.intervalAlerte = null;
		}
	}

	/**
	 * Méthode effectuant une alerte (passage du fond en rouge, puis de nouveau en noir au bout d'une seconde)
	 */
	alerte(): void {
		$('.main_container').css('background-color', 'red');
		setTimeout(() => {
			$('.main_container').css('background-color', 'black');
		}, 1000);
	}

	ngOnInit(): void {
		super.ngOnInit();
		$('#nomCapteur').text('Horloge à CO2');
	}

	ngOnDestroy(): void {
		super.ngOnDestroy();
		if (this.intervalAlerte) {
			clearInterval(this.intervalAlerte);
		}
	}
}
