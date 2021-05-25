import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../app.config';
import {map} from 'rxjs/operators';

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
export class PowerComponent implements OnInit, OnDestroy {
	// Attributs
	// ID du capteur
	id: string;
	// Unité affichée dans la page
	unite: string;
	// Nom de la valeur (utilisé pour les appels à l'API)
	nomValeur: string;
	// Si le graph doit commencer à 0
	beginAtZero: boolean;
	// Inteval pour lé récupération des valeurs des capteurs
	protected intervalData;
	// TimeOut pour le rafraichissement du graph
	protected timeOut;
	// Tableau contenant les valeurs du capteur
	protected niveauCapteurs;
	// IP du Raspberry inscrite dans le fichier de config
	protected ip = AppConfig.settings.config.ip;

	// Méthodes
	/**
	 * Constructeur du component
	 * @param actRoute Service ActivatedRoute définissant la route, permettant la récupération des paramètres comme l'ID
	 * @param router Service Router permettant la vue et manipulation d'URLs
	 * @param http Service HttpClient permettant défectuer des requêtes HTML asynchrones (similaire à Ajax)
	 */
	constructor(protected actRoute: ActivatedRoute, protected router: Router, protected http: HttpClient) {
		// Récupère le paramètre :id de la route
		this.id = this.actRoute.snapshot.params.id;
		this.unite = 'W';
		this.nomValeur = 'w';
		this.beginAtZero = false;

		// Force la réinitialisation du controleur lorsque le paramètre de la route change
		// (évite les bugs comme la duplication de récupérations de données)
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
	}

	/**
	 * Méthode récupérant les valeurs du capteur par requête HTML
	 * Passe par du JsonP pour éviter les problèmes de cross-origin
	 */
	getData(): void {
		this.http.jsonp(this.ip + '/Ajax/GetValues?capteur=' + this.id, 'callback').pipe(map(data => {
			console.log(data);
			this.niveauCapteurs = data;
			this.setNiveau();
		})).subscribe(data => {
		});
	}

	/**
	 * Affiche les valeurs des capteurs sur la page
	 */
	setNiveau(): void {
		// tslint:disable-next-line:forin
		for (const key in this.niveauCapteurs) {
			// Format de niveauCapteurs : [clé (nom de la valeur)] = valeur
			let valeur = this.niveauCapteurs[key];
			if (valeur === null) {
				valeur = -1;
			}
			$('#' + key).html(this.niveauCapteurs[key].toLocaleString(undefined).replace(',', '.'));
		}
	}

	/**
	 * Méthode permettant de construire le graph avec les valeurs récupérées
	 * @param values valeurs du graph
	 * @param labels labels du graph (x-axis)
	 */
	construireGraph(values, labels): void {
		const c = $('#graph');
		const ctx = (c.get(0) as HTMLCanvasElement).getContext('2d');

		// Créé un graphique dans le canva #graph
		// @ts-ignore
		// tslint:disable-next-line:no-unused-expression
		new Chart(ctx, {
			type: 'line', // format du graphique, ici graphique en lignes
			data: {
				labels, // définitions des labels sur l'axe x
				datasets: [{
					label: this.unite, // Légende des données
					data: values, // Donneés
					fill: false,
					borderColor: '#00A000', // Couleur de la bordure points
					pointHoverBorderColor: '#A00000' // Couleur de la bordure des points lorsque survolés par le curseur
				}]
			},
			options: {
				responsive: true, // Adaptation par rapport à la taille de la page
				maintainAspectRatio: false, // Permet la déformation du graph en fonction de la taille de la page
				legend: {
					labels: {
						fontColor: 'white' // Couleur des textes de ma légende
					}
				},
				scales: {
					yAxes: [{
						gridLines: {
							color: '#505050' // Couleurs des lignes verticales
						},
						ticks: {
							fontColor: 'white', // Couleurs des labels sur l'axe y
							beginAtZero: this.beginAtZero
						}
					}],
					xAxes: [{
						gridLines: {
							color: '#505050' // Couleurs des lignes horizontales
						},
						ticks: {
							fontColor: 'white' // Couleurs des labels sur l'axe x
						}
					}]
				}
			}
		});
	}

	/**
	 * Méthode récupérant les données pour le graphique
	 */
	getGraphData(): void {
		this.http.jsonp(this.ip + '/Ajax/Last24?capteur=' + this.id + '&nomValeur=' + this.nomValeur, 'callback')
			.pipe(map(data => {
				const values = [];
				const labels = [];
				// tslint:disable-next-line:prefer-for-of
				for (let i = 0; i < Object.keys(data).length; i++) {
					values.push(data[i].value);
					labels.push(data[i].time + ':00');
				}
				this.construireGraph(values, labels);

				// Force le refresh de la page lors du passage à la prochaine heure
				const timeUntilNewHour = 60 - new Date().getMinutes();
				this.timeOut = setTimeout(() => location.reload(), timeUntilNewHour * 60 * 1000);
			})).subscribe(data => {
		});
	}

	/**
	 * Méthode exécutant du javascript à l'ouverture de la page
	 */
	ngOnInit(): void {
		// Défini le nom du capteur en bas de page
		$('#nomCapteur').text(this.id);
		// Démarre la récupération des données toutes les 10s
		this.getData();
		this.intervalData = setInterval(() => this.getData(), 1000 * 10);
		this.getGraphData();
	}

	/**
	 * Méthode exécutant du javascript lors de la fermeture de la page
	 */
	ngOnDestroy(): void {
		clearInterval(this.intervalData);
	}
}
