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

## Accès à distance au Raspberry

Par SSH :

```
ssh pi@<ip du raspberry>
```

Par WinSCP :

1. Télécharger et installer WinSCP : https://winscp.net/eng/download.php
2. Configurer l'accès au Raspberry![image-20210518164259623](C:\Users\SPRUNIER\AppData\Roaming\Typora\typora-user-images\image-20210518164259623.png)
   1. Protocol : SFTP pour transfert par SSH
   2. Nom d'hôte : Adresse IP du Raspberry
   3. Nom d'utilisateur : Nom d'utilisateur sur le Raspberry
   4. Mot de passe : mot de passe de session du Raspberry
3. Cliquer sur "Connecter"
4. ![image-20210518164537231](C:\Users\SPRUNIER\AppData\Roaming\Typora\typora-user-images\image-20210518164537231.png)
   1. Partie gauche : Fichiers locaux
   2. Partie droite : Fichiers du Raspberry

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

Normalement des services s'occupent de lancer les 2 serveurs web.

Si ce n'est pas le cas : 

1. S'assurer que mosquitto est lancé sur le port 1883 (normalement il se lance par défaut)

2. Lancer le fichier server.js 

   ```
   cd ~/scriptNodeJS
   nodejs server.js &
   ```

3. Vérifier que les dépendances du site web sont installées

   ```
   cd ~/site_web/CapteurVraiAngular-master
   npm install
   ```

4. Lancer le site web (peut être un peu long)

   ```
   cd ~/site_web/CapteurVraiAngular-master
   npm start
   ```

5. Se connecter au site à l'adresse IP indiquée dans le fichier config, au port 4200

