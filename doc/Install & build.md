# Comment construire Respeqtt

basé sur la vidéo https://www.youtube.com/watch?v=DcCSq2Y9bow

## Installer et configurer npm 

https://docs.npmjs.com/cli/v6/using-npm/config

## Installer NativeScript 

https://www.npmjs.com/package/nativescript

npm install nativescript -g

Lorsque le script installe le JDK 8, arrêter, redémarrer le shell, vérifier Java_home (=jdk8) et relancer le script
terminer l'installation

### Vérifier que tout s'est bien passé en exécutant :
tns doctor 

qui doit conclure : no issue

### Créer l'application

tns create respeqtt
> Angular
> application = respeqtt
> template = hello world



cd respeqtt

### Importer les modules nécessaires
npm install node sass
ns plugin add nativescript-barcodescanner
ns plugin add @nativescript-community/ui-canvas 
ns plugin add nativescript-sqlite
ns plugin add nativescript-social-share
ns plugin add nativescript-html2pdf
ns plugin add nativescript-permissions
#corriger 2 vulnérabilités mineures
npm audit fix



## Installer MS CodeStudio et ses extensions Nativescript

## Compiler Respeqtt

### Se placer dans le répertoire, lancer MS CodeStudio :

code .

### Connecter son téléphone ou un émulateur :

activer le mode développeur : paramètres\à propos du téléphone \ cliquer 7 fois sur le numéro de version
aller dans "paramètres\option de développement" activer le debogague USB

### Dans la fenêtre terminal, taper :

tns run android --clean 

Si le téléchargement se bloque ou si les traces de la console n'apparaissent pas, débrancher et rebrancher immédiatement le téléphone. 


