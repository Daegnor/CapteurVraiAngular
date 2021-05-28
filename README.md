Auteur : Sébastien PRUNIER

# Documentation ESP32 récupération des données

Projet github : https://github.com/Daegnor/Communication_ESP32_Capteurs

## Configuration du réseau

Dans le fichier main.cpp, redéfinir la variable ssid et password pour connecter l'ESP32 au réseau WiFi.

Ensuite, indiquer l'adresse du Raspberry dans la variable mqtt_server

![image-20210519172324632](/images_doc/image-20210519172324632.png)

# Documentation site web capteurs

## Introduction

​	Projet github disponible sur https://github.com/Daegnor/Site_Angular_Capteurs

```
git clone https://github.com/Daegnor/Site_Angular_Capteurs.git
```

## Pré-requis

MQTT : Mosquitto

```
sudo apt install mosquitto
```

NodeJS

```
sudo apt install nodejs
```

NPM

```
sudo apt install npm
```

git

```
sudo apt install git
```

## Accès à distance au Raspberry

Par SSH :

```
ssh pi@<ip du raspberry>
```

Par WinSCP :

1. Télécharger et installer WinSCP : https://winscp.net/eng/download.php
2. Configurer l'accès au Raspberry![image-20210518164259623](/images_doc/image-20210518164259623.png)
   1. Protocol : SFTP pour transfert par SSH
   2. Nom d'hôte : Adresse IP du Raspberry
   3. Nom d'utilisateur : pi (par défaut)
   4. Mot de passe : raspberry (par défaut)
3. Cliquer sur "Connecter"
4. ![image-20210518164537231](/images_doc/image-20210518164537231.png)
   1. Partie gauche : Fichiers locaux
   2. Partie droite : Fichiers du Raspberry

## Hiérarchie du dossier

- dist -> Fichier de sortie des builds (non présent par défaut)
- API -> Contient les fichiers pour faire l'API (à coté du serveur pour Angular)
  - init.sql -> Fichier d'initialisation pour la base de données
  - installer_dependances_serveurAPI.sh -> Script pour installer les dépendances du serveur
  - serveurAPI -> Fichier NodeJS du serveur
- src
  - app -> Dossier contenant les fichiers du site web
    - horloge -> Dossier contenant le contrôleur (component en Angular) pour l'horloge (page par défaut lorsqu'on arrive sur le site)
      - horloge.component.css -> CSS pour le template d'horloge
      - horloge.component.html -> Template d'horloge
      - horloge.component.ts -> Fichier définissant le contrôleur d'horloge
    - horlogeGraph -> Dossier contenant le contrôleur pour la version de l'horloge contenant le graphique (même hiérarchie qu'horloge)
      - ...
    - power -> Dossier contenant le contrôleur pour les pages des capteurs Janitza (même hiérarchie qu'horloge)
      - ...
    - app.component.css -> css utilisé sur toutes les pages
    - app.component.html -> template html utilisé sur toutes les pages, équivalent au _Layout en ASP.NET MVC
    - app.component.ts -> Fichier définissant le contrôleur de app (contrôleur par défaut)
    - app.config.ts -> Fichier définissant la classe AppConfig, permettant de récupérer les variables des fichiers config
    - app.module.ts -> Fichier définissant les contrôleurs, permettant l'import de modules et définissant les providers (services d'Angular)
    - app-config.module.ts -> Interface pour le provider de configuration comme AppConfig
    - app-routing.module.ts -> Fichier allouant les routes aux contrôleurs
  - assets -> Contient les fichiers ressources envoyés au client, comme le CSS ou les images
    - config -> Dossier contenant les fichiers de configuration (notamment l'ip utilisée pour ajax)
      - config.prod.json -> configuration pour la production
      - config.dev.json -> configuration pour le développement
  - environnements -> Contient les fichiers .ts contenant les variables d'environnements. 
    - environnement.prod.ts -> Variables d'environnement pour le site de production, comme le nom de l'environnement pour trouver le fichier de config
    - environnement.ts -> Variable d'environnement pour le site en développement

## Configuration

### API

Configurer l'accès à la base de données

```
...
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
...
```

Si le serveur MQTT n'est pas sur la même machine, changer adresseIP :

```
...
//Client MQTT
var adresseIP = ip.address() //Remplacer l'adresse si le serveur MQTT n'est pas hébergé sur la même machine
var clientMQTT = mqtt.connect("mqtt://"+ adresseIP,{clientId:"nodejs_recept", port:"1883"});
...
```

S'il s'agit d'une nouvelle installation, installer les package requis : 

```
./installer_dependances_serveurAPI.sh
```

### Angular

Dans les fichier assets/config/config.dev.json, changer la valeur de "host" pour l'adresse de l'API (raspberry par défaut).

Exemple :

```
...
"config": {
    "ip": "http://192.168.240.127"
}
```

## Développement

### API

Le fichier serveurAPI.js est intégralement commenté.

Pour les adresses des valeurs des capteurs Janitza, elles sont disponibles sur la documentation fournie : https://www.janitza.com/manuals.html?file=files/download/manuals/current/UMG604-PRO/janitza-mal-umg604pro-en.pdf

Documentation des packages principalement utilisés :

Express : https://expressjs.com/en/5x/api.html

Modbus : https://www.npmjs.com/package/modbus-serial

MQTT : https://www.npmjs.com/package/mqtt

Tedious (Pour SQLServer) : http://tediousjs.github.io/tedious/

### Angular

Pour ajouter un contrôleur, utiliser les commandes AngularCLI (voir : https://angular.io/tutorial/toh-pt3), puis définir la route dans app-routing.module.ts

Pour le développement en détail d'un contrôleur, se référer aux commentaires des contrôleurs déjà existant.

## Passer en production

Changer l'ip indiquée dans le fichier assets/config/config.prod.json :

```
...
"config": {
    "ip": "http://192.168.240.127"
}
```

Pour passer le site Angular en production, exécuter le script prod :

```
npm run-script prod
```

Puis placer les fichiers du répertoire dist dans un serveur web. Rediriger toutes les routes vers index.html.

## Lancement 

Pour lancer l'API :

```
nodejs serveurAPI
```

 Pour le site Angular (en développement, sinon se référer à Passer en production) :

```
npm start
```

En production, un script peut être fait pour lancer l'API

```
sudo nano /etc/systemd/system/serveurAPI.service
```

```
[Unit]
Description=Serveur de valeur des capteurs NodeJS
After=network-online.target

[Install]
WantedBy=multi-user.target

[Service]
ExecStartPre=/bin/sleep 60
ExecStart=/usr/bin/nodejs [chemin vers le fichier]/serveurAPI.js
Type=simple
User=root
WorkingDirectory=[chemin vers le fichier]
Restart=on-failure
```

Puis

```
sudo systemctl daemon-reload
sudo systemctl enable serveurAPI.service
```

