# README

## Instructions

1. **Mettre à jour les URLs des requêtes :**
  - Allez dans le fichier `request.ts` dans `pwa/src/lib`.
  - Changez les URLs des requêtes par l'URL générée par le codespace.

2. **Mettre à jour les URLs des contrôleurs :**
  - Allez dans `RegisterController` et `RestPasswordController` dans `api/src/controller`.
  - Remplacez les URLs par l'URL générée par le codespace.
  - Utilisez la recherche de fichiers pour trouver et remplacer rapidement `https://curly-train-x5w767g6r47v3w94-443.app.github.dev`.

3. **Construire et exécuter Docker :**
  - Exécutez la commande : `docker compose build --no-cache`
  - Puis exécutez : `docker compose up --wait`

4. **Ouvrir le port :**
  - Ouvrez le port 443 pour accéder à l'application.

## Générer les clés JWT

- Allez dans le conteneur `back` de l'application Docker app-php.
- Exécutez la commande : `php bin/console lexik:jwt:generate-keypair`

## API Plateform

- La documentation de l'API est disponible à `/docs`.
- Routes disponibles dans l'application front pour le moment :
  - `/signin` pour créer un compte.
  - `/signup` pour se connecter. La connexion renvoie un jeton nommé `jwt_token` dans les cookies du navigateur.

## Réinitialisation du mot de passe

- Pour réinitialiser votre mot de passe, utilisez la route `/login` et sélectionnez "Mot de passe oublié".
- Entrez votre email et cliqué sur le lien dans l'email dans Mailpit au port 8025.
- Cliquez sur le lien dans l'email pour modifier votre mot de passe. Note : Le jeton est valable pour une seule tentative.

## Vérifier le statut du compte

- Vérifiez le statut de vérification du compte en entrant l'ID utilisateur dans la route `GET users/{id}`.
- Le compte est vérifié si `emailverify = true`.
- Vous pouvez vérifier votre email grâce à un mail envoyé après la création du compte sur Mailpit.

## Video de test
https://youtu.be/T91zRI66MC8
