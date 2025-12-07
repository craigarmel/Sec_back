# Guide d'utilisation de la collection Postman

## Installation

1. Ouvrez Postman
2. Cliquez sur **Import** dans le coin supérieur gauche
3. Importez les deux fichiers :
   - `postman_collection.json` (la collection)
   - `postman_environment.json` (l'environnement)

## Configuration

### Environnement

L'environnement "Blog API - Local" est préconfiguré avec :
- `base_url`: `http://localhost:4000` (modifiez si votre serveur tourne sur un autre port)

### Cookies

⚠️ **Important** : L'API utilise des cookies HTTP-only pour l'authentification. 

Pour que Postman envoie automatiquement les cookies :
1. Allez dans **Settings** (⚙️) > **General**
2. Activez **"Send cookies"**
3. Ou utilisez l'onglet **Cookies** dans la requête pour gérer manuellement les cookies

## Ordre recommandé pour tester

### 1. Authentification

1. **Register** - Créez un nouveau compte
   - Modifiez l'email et le mot de passe dans le body
   - Le mot de passe doit respecter les règles de sécurité (voir `password-validation.dto.ts`)

2. **Login** - Connectez-vous
   - Utilisez les mêmes identifiants que lors de l'inscription
   - Le cookie `access_token` sera automatiquement stocké par Postman
   - L'ID de l'utilisateur sera sauvegardé dans la variable `user_id`

### 2. Posts

3. **Create Post** - Créez un article
   - L'ID de l'article sera sauvegardé dans `post_id`
   - Vous devez être authentifié (cookie présent)

4. **Get All Posts** - Liste tous les articles (public)

5. **Get Post by ID** - Récupère un article spécifique (public)

6. **Update Post** - Modifie un article (auteur uniquement)

7. **Delete Post** - Supprime un article (auteur uniquement)

### 3. Comments

8. **Create Comment** - Ajoute un commentaire à un article
   - L'ID du commentaire sera sauvegardé dans `comment_id`
   - Vous devez être authentifié

9. **Get Comment by ID** - Récupère un commentaire (public)

10. **Delete Comment** - Supprime un commentaire (auteur uniquement)

### 4. Users

11. **Get User by ID** - Récupère votre profil ou celui d'un autre utilisateur
    - Vous ne pouvez voir que votre propre profil (sauf si vous êtes admin)

12. **Update User** - Modifie votre profil

13. **Get All Users (Admin)** - Liste tous les utilisateurs
    - Nécessite le rôle ADMIN

### 5. Legal & App

14. **Get Privacy Policy** - Politique de confidentialité (public)

15. **Get Terms of Service** - Conditions d'utilisation (public)

16. **Health Check** - Vérifie que l'API fonctionne (public)

## Variables automatiques

La collection utilise des scripts de test pour sauvegarder automatiquement :
- `user_id` : Après un login réussi
- `post_id` : Après la création d'un article
- `comment_id` : Après la création d'un commentaire

Ces variables sont utilisées dans les requêtes suivantes.

## Gestion des cookies

Si vous avez des problèmes d'authentification :

1. **Vérifier les cookies** :
   - Cliquez sur l'onglet **Cookies** dans une requête
   - Vérifiez que le cookie `access_token` est présent

2. **Ré-authentification** :
   - Si le token expire (30 minutes), refaites un **Login**

3. **Déconnexion** :
   - Utilisez **Logout** pour supprimer le cookie

## Exemples de body

### Register
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePass123!",
  "consentGiven": true
}
```

### Login
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Create Post
```json
{
  "title": "Mon premier article",
  "content": "Ceci est le contenu de mon article. Il doit contenir au moins 10 caractères pour être valide.",
  "imageUrl": "https://example.com/image.jpg"
}
```

### Create Comment
```json
{
  "content": "Ceci est un commentaire sur l'article."
}
```

### Update User
```json
{
  "name": "John Updated",
  "email": "newemail@example.com"
}
```

## Codes de réponse

- `200` : Succès
- `201` : Créé avec succès
- `400` : Erreur de validation
- `401` : Non authentifié
- `403` : Accès interdit (IDOR protection, rôle insuffisant)
- `404` : Ressource non trouvée
- `500` : Erreur serveur

## Notes importantes

1. **Rate Limiting** : L'API limite à 10 requêtes par minute par IP
2. **Validation** : Tous les champs sont validés (email, longueur minimale, etc.)
3. **Sécurité** : 
   - Les mots de passe doivent être forts
   - Les cookies sont HTTP-only et sécurisés
   - Protection IDOR : vous ne pouvez modifier que vos propres ressources
4. **CORS** : Configuré pour `http://localhost:3000` par défaut
