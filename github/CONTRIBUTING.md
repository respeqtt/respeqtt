# Introduction

### Bienvenue !

>Tout d’abord, merci de votre intérêt pour RESPEQTT. Votre participation va permettre à tous les pongistes de disposer d’un outil moderne de saisie des résultats des compétitions FFTT (et autres !).

### Pourquoi ces recommandations ?
> Le suivi de ces recommandations montre que vous respectez le travail et le temps passé par les développeurs et les gestionnaires de cette application. En retour, ils montreront leur respect pour votre contribution en vous adressant des Faits Techniques (issues), des demandes d’évolution et en vous apportant leur assistance.

### Quelles sont les contributions recherchées ?

Actuellement, nous recherchons des contributeurs pour finaliser la conception et pour entamer les développements des différents modules. Nous aurons également besoin par la suite de testeurs sur les différentes plateformes (Android/IOS) pour nous remonter des anomalies et nous permettre de finaliser l’application.

### Quelles sont les contributions dont nous n’avons pas besoin ?
Merci de ne pas soumettre ici de Faits Techniques concernant GIRPE ou SPID.

# Règles de base

Merci de respecter les contributions de chacun et de rester courtois en toutes circonstances. 
Merci également de bien lire et prendre en compte la licence utilisée.
Merci de recopier le fichier AVIS_LICENCE.txt en tête de chaque fichier source.

> Responsabilités
Tout d'abord, il est nécessaire de prendre en compte la licence utilisée : LGPL v3. En résumé, c'est une licence open source/copyleft non virale, c'est à dire que :

1. il est possible d'utiliser RESPEQTT intégralement et sans modification en dehors de projets open sources à condition que RESPEQTT soit clairement identifié comme sous licence LGPL ;
2. toute modification apportée à RESPEQTT est nécessairement sous licence LGPL ;
3. la diffusion et l'utilisation de RESPEQTT doivent être libres et gratuites ;
4. les sources sont publics et peuvent être réutilisés par n'importe qui sous les trois conditions précédentes.

Il est de la responsabilité de chacun de tester les modules qui sont livrés. Idéalement, il est souhaité qu’un module soit pris en charge de sa conception jusqu’à sa finalisation. Un module est un composant Angular.
De même, il est demandé de commenter le code au niveau de chaque interface (paramètres et valeurs retournées par les méthodes, attributs des classes). Des commentaires ailleurs sont également les bienvenus !

Chacun doit s’assurer que les modules livrés sont compatibles Android et IOS. Pour les développements, cela est assuré par NativeScript. Mais cela doit être vérifié pour tout ajout (librairie, …) qui pourrait être appelé. Par exemple, l’appel à une application externe nommée pour la lecture des QRCode est à proscrire puisqu’elle ne sera pas installée sur tous les mobiles Android et IOS.
Créer des Faits Techniques (issues) pour toute demande de modification significative ou impactant les autres modules. En discuter librement pour permettre une décision éclairée de la communauté.
Merci d’accueillir les nouveaux contributeurs avec bienveillance et encouragements !

# Comment contribuer ?
1. Créer un fork sur GitHub
2. Cloner le projet sur votre PC
3. Commiter votre travail
4. Envoyer une Pull request pour qu’on puisse réviser et accepter les modifications effectuées


NOTE: faites attention à bien faire un merge sur le code le plus récent avant de faire la pull request !
> Par où commencer ? Jeter un œil sur les tâches de la TODO LIST dans les projets

### Bonus pour ceux qui n’ont jamais contribué à un développement open source auparavant 
http://makeapullrequest.com/
http://www.firsttimersonly.com/
https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github

# Comment rapporter un Fait Technique
### Failles de sécurité
> Si vous avez découvert une faille de sécurité, envoyer un mail à hot.1@free.fr.

> Pour savoir si vous avez rencontré une faille de sécurité, posez-vous ces deux questions:
> * Est-ce que je peux accéder à quelque chose qui ne m’appartient pas ou à laquelle je ne devrais pas avoir accès ?
> * Est-ce que je peux enlever un accès à quelqu’un d’autre ?
>
> Si une des deux réponses est « oui », c’est une faille de sécurité. Remarquez que même si vous avec répondu « non » aux deux et que vous avez un doute, envoyez un mail à hot.1@free.fr.

### Comment remonter un Fait Technique ?
Vous pouvez les signaler sur le site (menu : « issues »).

Merci de préciser systématiquement :
> 1. La version de l’application
> 2. La plateforme (mobile + OS)
> 3. Les actions qui ont conduit à observer le Fait Technique
> 4. Ce que vous avez observé (ne pas hésiter à inclure une copie d’écran si possible)
> 5. Ce que vous attendiez à voir à la place

# Comment proposer une amélioration ?
Vous pouvez les signaler sur le site (menu : « issues »). Bien préciser AMELIORATION au début du titre. Détailler autant que possible le comportement souhaité et expliquer en quoi c’est une amélioration. De préférence utiliser le label « enhancement ».

# Revue de code / Acceptation des contributions
Toutes les « pull request » sont revues avant acceptation. Si possible, un test rapide est effectué. Un retour est effectué dans les meilleurs délais (compter 1 semaine max).

# Communauté

à développer : site web, chat, visio, ...



