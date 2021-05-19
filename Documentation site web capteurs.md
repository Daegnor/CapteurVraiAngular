[TOC]

# Documentation ESP32 récupération des données

Projet github : https://github.com/Daegnor/Communication_ESP32_Capteurs

## Configuration du réseau

Dans le fichier main.cpp, redéfinir la variable ssid et password pour connecter l'ESP32 au réseau WiFi.

Ensuite, indiquer l'adresse du Raspberry dans la variable mqtt_server

![image-20210519172324632](\images_doc\image-20210519172324632.png)

# Documentation site web capteurs

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
   3. Nom d'utilisateur : pi
   4. Mot de passe : raspberry
3. Cliquer sur "Connecter"
4. ![image-20210518164537231](/images_doc/image-20210518164537231.png)
   1. Partie gauche : Fichiers locaux
   2. Partie droite : Fichiers du Raspberry

## Disposition des programmes

~/scriptNodeJS : Dossier contenant les scripts pour le nodejs, c'est-à-dire le script récupérant les valeurs du MQTT et établissant un serveur web pour les récupérer

~/scriptNodeJS/CapteurVraiAngular : Dossier contenant le site web Angular (version production)

Les fichiers sources peuvent être obtenu en clonant le repository

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

Dans le fichier ~/scriptNodeJS/CapteurVraiAngular/assets/config/config.prod.json, changer la valeur de "host" pour l'adresse ip du raspberry.

Exemple :

```
...
"config": {
    "ip": "192.168.240.127"
  }
```

## Lancement

Normalement des services s'occupent de lancer les 2 serveurs web (attendre environs 1 minute au démarrage du Raspberry).

Si ce n'est pas le cas : 

1. S'assurer que mosquitto est lancé sur le port 1883 (normalement il se lance par défaut)

2. Lancer le fichier serveurNodeJS.js 

   ```
   cd ~/scriptNodeJS
   nodejs serveurNodeJS.js &
   ```

3. Lancer le site web angular

   ```
   cd ~/scriptNodeJS
   nodejs serveurAngular.js
   ```

4. Se connecter au site à l'adresse IP indiquée dans le fichier config, port 80

