
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


# Changelog

Voici une liste qui liste les informations nécessaire pour l'utilisation du project.

## [RENDU 1] - Semaine du 11 Novembre
  
 
### Added
 
### Changed
  

