# RESPEQTT
Application de saisie et de restitution des scores du championnat par équipes de tennis de table

# Exigences
- Multiplateformes (IOS/android)
- Sécurité des échanges entre mobiles
- IHM responsive
- fonctionnement souple avec 1 ou n mobiles
- conf mini : seul le capitaine qui reçoit  dispose d'un mobile avec l'appli
- conf moyenne : les deux capitaines disposent d'un mobile
- conf maxi : tous les joueurs disposent d'un mobile avec l'appli
- pas besoin de liaison internet pendant les rencontres (uniquement avant pour télégharger les infos et après pour envoyer les résultats à SPID)
- fonctionne quelle que soit la formule de la compétition (nb de joueurs, nb de parties, nb de sets par partie)

# TO DO list
- revoir responsive pour les pages de compo et de saisie des résultats
- revoir saisie des doubles pour permettre annuler au milieu
- envoi feuille de match format texte ou md ? par mail? Sait composer en html mais ne sait pas visualiser (partager le fichier avec explorateur) ni intégrer la mise en forme en tant que corps du mail (trop gros + mise en forme pas gérée)
- API SPID entrante
- API SPID sortante

# Outils
Développement avec NativeScript
IHM Angular/Typescript
BDD SQLite

