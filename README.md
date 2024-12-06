
# Instructions

1. **Construire et exécuter Docker :**
  - Exécutez la commande : `docker compose build --no-cache`
  - Puis exécutez : `docker compose up --wait`

2. **Ouvrir le port :**
  - Ouvrez le port 443 pour accéder à l'application.
  - Ouvrez le port 8025 pour accéder a la boite mail de test Mailpit

3. **Mettre à jour les URLs des requêtes :**
  - Allez dans le fichier `.env.local` dans le dossier `pwa`.
  - Changez la valeur présente dans le champ `NEXT_PUBLIC_API_BASE_URL` par l'URL de l'application sur le port 443.
  - Idm pour le back allez dans le fichier `.env` dans le dossier `api`.
  - Changez la valeur présente en bas du fichier dans le champ `APP_URL` par l'URL de l'application sur le port 443.

## Générer les clés JWT

- Allez sur l'extention docker de VSCode et ouvrez une console pour le conteneur `app-php` 
- Exécutez la commande : `php bin/console lexik:jwt:generate-keypair`

## Route disponible

- La documentation de l'API est disponible à `/docs`.
- Routes disponibles dans l'application front pour le moment :
  - `/signin` pour créer un compte.
  - `/login` pour se connecter. La connexion renvoie un jeton nommé `jwt_token` dans les cookies du navigateur.

## Réinitialisation du mot de passe

- Pour réinitialiser votre mot de passe, utilisez la route `/login` et sélectionnez "Mot de passe oublié".
- Entrez votre email et cliqué sur le lien dans l'email dans Mailpit.
- Cliquez sur le lien dans l'email pour modifier votre mot de passe. Note : Le jeton est valable pour une seule tentative.

## Vérifier le statut du compte

- Vérifiez le statut de vérification du compte en entrant l'ID utilisateur dans la route `GET users/{id}`.
- Le compte est vérifié si `emailverify = true`.
- Vous pouvez vérifier votre email grâce à un mail envoyé après la création du compte sur Mailpit.

## Video de test
https://youtu.be/T91zRI66MC8


# RENDUS

Voici une liste qui liste les informations nécessaire pour l'utilisation du project.

## [Rendu 1 - Semaine du 11 Novembre]

### - Links
  
  - [Branche du rendu](https://github.com/isaacdemeers/sae-501/tree/RENDU1)
 
 ### - Changelog

#### Updated
- inscription
- connexion
- Vérification d'email
- réinitialisation de mot de passe

#### Added
- création d'un évènement public
- visualisation de l'évènement
- système de détection si l'utilisateur est connecté ou non pour la page principale
- affichage des évènements suggérés (correspond aux évènements qui commencent bientôt)

## [Rendu 2 - Semaine du 18 Novembre]

Travaille sur la structure des fichiers, correction de bugs et lancement des nouvelle fonctionnalités

### - Links
  
  - [Branche du rendu](https://github.com/isaacdemeers/sae-501/tree/RENDU2)
 
 ### - Changelog

#### Updated
- Nom des composents pour respecter une camelCase
- Structure des fichiers pour une meilleur organisation

#### Added
- affiche les event et filtres dans la Searchbar. Permet de filtrer les événements.

## [Rendu 3 - Semaine du 25 Novembre]

### - Links
  
  - [Branche du rendu](https://github.com/isaacdemeers/sae-501/tree/RENDU3)
 
 ### - Changelog

#### Updated
- /calendar : Affiche tout les evenements de la base
- /calendar : Quand on clique sur l'evenement la side bar affiche correctement les infos de l'event

#### Added
- Lister les évents au quel un user est inscrit 
- Les pages légal + text footer 
- affichage d'un event fini
- ajout partager l'event et visualisation des élément de la base avec le /admin seulement en localhost pas sur codespace
- Ajout de la page de profil
- Possibilité de modifier les informations d’un utilisateur (sauf photo de profil "s3 issue")


## [Rendu 4 - Semaine du 2 Décembre]

### - Links
  
  - [Branche du rendu](https://github.com/isaacdemeers/sae-501/tree/RENDU4)
 
 ### - Changelog

#### Updated
- event : modification de l'ui de création d'évènement
- event : modification de certain élément de la page d'évènemeent
- login : modification du login avec 2 cookie pour le jwttoken séparer entre le payload et la signature + sécurisation d'accès a certaines route


#### Added
- Superadmin
- Logout
- Modération d'évènement
- Modification des informations d'un utilisateur


