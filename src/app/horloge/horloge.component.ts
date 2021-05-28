import {Component, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
export class HorlogeComponent extends HorlogeGraphComponent {

	constructor(protected actRoute: ActivatedRoute, protected router: Router, protected http: HttpClient) {
		super(actRoute, router, http);
	}

	getGraphData(): void {
		return;
	}
}
