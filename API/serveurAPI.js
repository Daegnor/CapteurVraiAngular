// -------- DEFINITION DES MODULES ET VARIABLES --------
//Module body-parser
//permet de récupérer les données data de la requête ajax
const bodyParser = require('body-parser');
//Module serveur web express
const express = require('express');
//Module mqtt
const mqtt = require('mqtt');
//Module modbus tcp
const ModbusRTU = require("modbus-serial");
//Module IP
const ip = require("ip");
//SQLServer
const tedious = require('tedious');
var Request = tedious.Request;
var TYPES = tedious.TYPES;

//Configuration de l'accès à la base de données
var config = {
	server: '',  //update me
	authentication: {
		type: 'default',
		options: {
			userName: '', //update me
			password: ''  //update me
		}
	},
	options: {
		//On désactive la correction des heures à la timezone
		useUTC: false,
		// If you are on Microsoft Azure, you need encryption:
		encrypt: false,
		database: ''  //update me
	}
};

var requeteInsert = "INSERT INTO DATA(LIB_DATA, VAL_DATA, DTE_DATA, CLE_SENSOR) VALUES(@Lib, @Val, DEFAULT, (SELECT CLE_SENSOR from SENSOR where LIB_SENSOR LIKE @Capteur));";

var requeteGet = "SELECT LIB_DATA, VAL_DATA FROM DATA WHERE CLE_DATA IN (SELECT MAX(CLE_DATA) from DATA GROUP BY CLE_SENSOR, LIB_DATA HAVING CLE_SENSOR = (SELECT CLE_SENSOR from SENSOR where LIB_SENSOR LIKE @Capteur));";

var requeteGraph = "SELECT VAL_DATA, DTE_DATA FROM DATA WHERE DTE_DATA >= @Yesterday and DTE_DATA < @Today and LIB_DATA LIKE @Lib and CLE_SENSOR = (SELECT CLE_SENSOR from SENSOR where LIB_SENSOR LIKE @Capteur) ORDER BY DTE_DATA ASC";

//Clients modbus
var serveurAPI = express();
const portAPI = 8080

// -------- MQTT --------

//Client MQTT
var adresseIP = ip.address() //Remplacer l'adresse si le serveur MQTT n'est pas hébergé sur la même machine
var clientMQTT = mqtt.connect("mqtt://" + adresseIP, {clientId: "nodejs_recept", port: "1883"});
console.log("Connexion au serveur mqtt");

/**
 * Réception d'une valeur par le serveur MQTT
 */
clientMQTT.on('message', function (topic, message, packet) {
	let sTopic = topic.split("/");
	let nomCapteur = sTopic[2];
	let lib_valeur = sTopic[3];
	let valeur = message.toString();
	sauvegardeEnDB(nomCapteur, lib_valeur, valeur);
});

/**
 * Sauvegarde d'une valeur en base de donnée
 * @param nomCapteur
 * @param lib_valeur
 * @param valeur
 */
function sauvegardeEnDB(nomCapteur, lib_valeur, valeur) {
	//Pour chaque sauvegarde, créé une nouvelle connexion vers la base
	//Evite les tentatives de requête pendant qu'une autre est en cours
	let db = new tedious.Connection(config);
	db.on('connect', (err) => {
		if (err) {
			console.log(err);
			return;
		}
		request = new Request(requeteInsert);
		request.addParameter('Lib', TYPES.NVarChar, lib_valeur);
		request.addParameter('Val', TYPES.NVarChar, valeur);
		request.addParameter('Capteur', TYPES.NVarChar, nomCapteur);

		request.callback = () => {
			db.close();
		}
		db.execSql(request);
	});
	db.connect();
}

/**
 * Connexion au serveur MQTT, puis abonnement aux sujets sous home/eai/
 */
clientMQTT.on("connect", function () {
	console.log("Connexion au MQTT Broker établie");
	clientMQTT.subscribe("home/eai/+/+", {qos: 1});
});

clientMQTT.on("error", function (error) {
	console.log("Impossible de se connecter au MQTT Broker : \n" + error);
	process.exit(1)
});

// -------- MODBUS --------

class CapteurJanitza {
	constructor(nom, ip) {
		this.nom = nom;
		this.ip = ip;
	}
}

var capteursJanitza = [];

capteursJanitza[0] = new CapteurJanitza("Janitza 604", "192.168.240.165");

//Toutes les secondes, récupérations des données du capteur janitza et envoie vers le MQTT Broker
setInterval(function () {
	for (let i = 0; i < capteursJanitza.length; i++) {
		let modbus = new ModbusRTU();
		try {
			modbus.connectTCP(capteursJanitza[i].ip, {port: 502});
			setTimeout(() => {
				modbus.readHoldingRegisters(19026, 2, (err, data) => {
					sendJanitzaData(capteursJanitza[i].nom, "w", err, data);
					modbus.close();
				});
			}, 1000);
		} catch (err) {
			//console.log(err);
			modbus.close();
		}
	}
}, 1000 * 60);

/**
 * Envoie de la valeur du capteur Janitza vers le serveur MQTT
 * @param nom
 * @param parametre
 * @param err
 * @param data
 */
function sendJanitzaData(nom, parametre, err, data) {
	if (!data) {
		console.log(err);
		return;
	}
	// Create a buffer
	var buf = new ArrayBuffer(4);
	// Create a data view of it
	var view = new DataView(buf);

	// set bytes
	data.buffer.forEach(function (b, i) {
		view.setUint8(i, b);
	});

	// Read the bits as a float; note that by doing this, we're implicitly
	// converting it from a 32-bit float into JavaScript's native 64-bit double
	var num = view.getFloat32(0);
	// Done
	//Envoie de la valeur en float à 1 décimales
	clientMQTT.publish('home/eai/' + nom + '/' + parametre, Number.parseFloat(num).toFixed(0).toString());
}

// -------- SERVEUR WEB POUR LES CAPTEURS --------

//Creation du serveur web permettant la récupération des données des capteurs, au port 8080
serveurAPI.use(bodyParser.urlencoded({extended: false}));
serveurAPI.use(bodyParser.json());

serveurAPI.get("/Ajax/GetValues", function (req, res) {
	let capteur = req.query.capteur;
	sendValues(capteur, res);
})

serveurAPI.post("/Ajax/GetValues", function (req, res) {
	let capteur = req.body.capteur;
	sendValues(capteur, res);
})

function sendValues(capteur, res) {
	let reponse = {};
	let db = new tedious.Connection(config);
	db.on('connect', (err) => {
		if (err) {
			console.log(err);
			return;
		}
		request = new Request(requeteGet);
		request.addParameter('Capteur', TYPES.NVarChar, capteur);

		//Enregistrement des valeurs des tuples dans reponse
		request.on('row', function (columns) {
			reponse[columns[0].value] = columns[1].value
		});

		//Lorsque la request se termine, on renvoie reponse
		request.callback = () => {
			db.close();
			res.jsonp(reponse);
		}
		db.execSql(request);
	});
	db.connect();
}

serveurAPI.get("/Ajax/Last24", function (req, res) {
	capteur = req.query.capteur;
	nomValeur = req.query.nomValeur;
	sendGraphValues(res, capteur, nomValeur)
});

serveurAPI.post("/Ajax/Last24", function (req, res) {
	capteur = req.body.capteur;
	nomValeur = req.body.nomValeur;
	sendGraphValues(res, capteur, nomValeur)
});

function sendGraphValues(res, capteur, nomValeur) {
	reponse = [];

	//Récupération de la date actuelle
	var today = new Date();
	//On set today à la dernière heure
	today.setMinutes(0);
	today.setSeconds(0);
	today.setMilliseconds(0);

	var yesterday = new Date(today.getTime());
	yesterday.setDate(yesterday.getDate() - 1);

	let db = new tedious.Connection(config);
	db.on('connect', (err) => {
		if (err) {
			console.log(err);
			return;
		}
		request = new Request(requeteGraph);
		request.addParameter('Capteur', TYPES.NVarChar, capteur);
		request.addParameter('Lib', TYPES.NVarChar, nomValeur);
		request.addParameter('Yesterday', TYPES.DateTime, yesterday);
		request.addParameter('Today', TYPES.DateTime, today);

		//Heure du dernier enregistrement
		var lastHeure = null;
		//Nombre de valeurs enregistrée
		var i = 0

		//Enregistrement des valeurs des tuples dans reponse
		//On enregistre des moyennes par heure
		request.on('row', function (columns) {
			let value = columns[0].value
			let date = new Date(columns[1].value);
			//console.log(date);
			//Si le tuple a une heure différente du dernier enregistrer
			if(lastHeure == null || lastHeure !== (date.getHours()+1)){
				//La moyenne des valeurs enregistrée est indiqué pour l'heure suivante
				//Exemple : la moyenne des valeurs de 8h à 9h est indiquée à 9h
				lastHeure = (date.getHours()+1);
				//Lorsqu'on change d'heure, on calcul la moyenne de l'heure précédente
				if(i !== 0)
					reponse[reponse.length - 1].value = Math.floor(reponse[reponse.length - 1].value / i);
				//Puis on rentre l'objet contenant la moyenne de la prochaine heure calculée (avec un zéro non-significatif si besoin)
				reponse.push({time: lastHeure.toString().padStart(2, "0"), value: 0});
				i = 0;
			}
			reponse[reponse.length - 1].value += value;
			i++;
		});

		//Lorsque la request se termine, on renvoie reponse
		request.callback = () => {
			db.close();
			if(i !== 0)
				reponse[reponse.length - 1].value = Math.floor(reponse[reponse.length - 1].value / i);
			res.jsonp(reponse);
		}
		db.execSql(request);
	});
	db.connect();
}

serveurAPI.listen(portAPI, () => {
	console.log("Ecoute sur " + portAPI);
});
