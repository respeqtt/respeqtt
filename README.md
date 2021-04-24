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

    Echange de QRCode pour la compo des doubles
    page verso de la feuille de match avec réserves, réclamations et rapport du JA
    API SPID (entrantes : joueurs et équipes ; sortante : résultats)
    valider la gestion des cartons
    Tests finaux
    revoir le look ?
    Tests avec Android 11 ?
    Déployer dans GoogleStore
    Produire et tester une version iPhone


# Outils
Développement avec NativeScript
IHM Angular/Typescript
BDD SQLite

