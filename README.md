# Intra formatif A26 — corrigé commenté

Le corrigé des deux questions est directement dans les fichiers de départ.
Les commentaires « Étape » expliquent le raisonnement et les appels.
L'énoncé original `Examen Intra.docx` est conservé.

## Où lire les explications

- Question 1 : `question1/dessins-rect/app/page.tsx` : appel HTTP, interprétation des événements, récursion, pauses et couleur.
- `question1/Dessins/Dessins/Controllers/DessinsController.cs` : séquence des événements.
- `question1/Dessins/Dessins/Events/DrawStar.cs` : les deux corrections de l'étoile.
- `DrawingEvent.cs` et `ChangeColor.cs` : sérialisation et nouvel événement.
- `question1/dessins-rect/lib/utils.ts` : nombre de branches Konva.
- Question 2 : `question2/SignalR/Hubs/PizzaHub.cs` : connexions, groupes et destinataires.
- `question2/signalr-react/app/page.tsx` : connexion, réception des quatre messages, appels invoke et nettoyage.

## Lancer la question 1

Ouvrir deux terminaux à la racine de ce dossier.

Terminal serveur :
```powershell
cd question1/Dessins/Dessins
dotnet run --launch-profile http
```

Terminal client :
```powershell
cd question1/dessins-rect
npm.cmd install
npm.cmd run dev
```

Ouvrir http://localhost:3000. Utiliser HTTP comme demandé dans l'énoncé.
Le serveur écoute sur http://localhost:5269.
Événements 1 : un carré bleu (2,2).
Événements 2 : cercle bleu (1,1), pause 3 s, deux carrés rouges (0,2) et (2,2), pause 1 s, étoile jaune (1,3), rayon intérieur 20.
Les coordonnées du serveur sont multipliées par 100 dans les fonctions de dessin.

## Lancer la question 2

Arrêter le client de la question 1 avant de lancer celui-ci : les deux utilisent le port 3000, autorisé par CORS.

Terminal serveur :
```powershell
cd question2/SignalR
dotnet run --launch-profile http
```

Terminal client :
```powershell
cd question2/signalr-react
npm.cmd install
npm.cmd run dev
```

Ouvrir http://localhost:3000 dans plusieurs onglets. Serveur : http://localhost:5282.
Choisir la même pizza dans deux onglets, une autre dans un troisième.
Ajouter 2 $ : seuls les membres du même groupe doivent recevoir la somme.
Sans ananas : prix 10 $. Avec ananas : prix 12 $.
Acheter retire le prix et ajoute une pizza; le serveur refuse de modifier les valeurs si le solde ne suffit pas.
Changer de pizza quitte le groupe précédent. Fermer un onglet met à jour le nombre de connexions.
Chaque onglet compte comme un utilisateur connecté; il n'y a pas d'authentification dans cet exercice.
Les images de pizzas ne sont pas dans le dépôt initial : les choix sont affichés comme boutons textuels pour rester utilisables.
Les données restent en mémoire et sont réinitialisées au redémarrage du serveur.

## Vérifications effectuées le 20 octobre 2026

- Deux serveurs .NET 10 : compilation réussie, zéro erreur et zéro avertissement.
- Deux clients Next.js : compilation de production réussie, vérification TypeScript incluse.
- Appels réels aux deux routes dessins : types JSON et séquence vérifiés.
- Trois connexions réelles SignalR : compteur, prix, isolation des groupes, cinq ajouts de 2 $, achat, changement de groupe et déconnexion vérifiés.
- Le rendu visuel et les délais de l'animation n'ont pas été vérifiés dans un navigateur.

Références :
- https://learn.microsoft.com/aspnet/core/signalr/javascript-client?view=aspnetcore-10.0
- Documentation Next.js embarquée : node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md
