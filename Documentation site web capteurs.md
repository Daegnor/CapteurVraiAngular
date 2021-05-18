# Documentation site web capteurs



[TOC]



## Introduction

​	Projet github disponible sur https://github.com/Daegnor/CapteurVraiAngular

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



## Disposition des programmes

~/scriptNodeJS : Dossier contenant les scripts pour le nodejs, c'est-à-dire le script récupérant les valeurs du MQTT et établissant un serveur web pour les récupérer

~/site_web/CapteurVraiAngular-master : Dossier contenant le site web Angular

Si CapteurVraiAngular-master n'existe pas, le cloner

```
git clone https://github.com/Daegnor/CapteurVraiAngular
```

## Configuration

### NodeJS

Aucune configuration requise dans le fichier server.js.

S'il s'agit d'une nouvelle installation, installer les package requis (depuis le dossier ~/scriptNodeJS) : 

```
npm i body-parser cors express path mqtt ip --save
```

### Angular

Dans le fichier ~/site_web/CapteurVraiAngular-master/assets/config/config.development.json, changer la valeur de "host" pour l'adresse ip du raspberry.

Exemple :

```
...
"config": {
    "ip": "192.168.240.127"
  }
```

Modifier également la partie scripts : start du fichier package.json afin d'y mettre l'adresse du raspberry

```
nano ~/site_web/CapteurVraiAngular-master/package.json
```

```
...
"scripts": {
    "ng": "ng",
    "start": "ng serve --host 192.168.240.127",
    ...
  },
```

## Lancement

1. S'assurer que mosquitto est lancé sur le port 1883 (normalement il se lance par défaut)

2. Lancer le fichier server.js 

   ```
   cd ~/scriptNodeJS
   nodejs server.js
   ```

3. Vérifier que les dépendances du site web sont installées

   ```
   cd ~/site_web/CapteurVraiAngular-master
   npm install
   ```

4. Lancer le site web

   ```
   cd ~/site_web/CapteurVraiAngular-master
   npm start
   ```

   

