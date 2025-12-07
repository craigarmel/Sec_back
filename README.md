# API Blog Sécurisée

API REST pour un site web de blog développée avec NestJS, conforme aux meilleures pratiques de sécurité.

## 🚀 Installation

### Prérequis

- Node.js 20+
- PostgreSQL 14+
- npm ou yarn

### Variables d'environnement

Copiez `.env.example` vers `.env` et configurez les variables :

```bash
cp .env.example .env
```

Variables importantes :
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` : Configuration PostgreSQL
- `JWT_SECRET` : Clé secrète pour JWT (minimum 32 caractères)
- `SESSION_SECRET` : Clé secrète pour les sessions
- `NODE_ENV` : `development` ou `production`

### Installation des dépendances

```bash
npm install
```

### Base de données

Créer la base de données PostgreSQL :

```sql
CREATE DATABASE blog_db;
```

L'application créera automatiquement les tables au démarrage en mode développement.

### Démarrage

```bash
# Développement
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 🔒 Sécurité

### Fonctionnalités de sécurité implémentées

- ✅ Authentification JWT avec cookies HttpOnly
- ✅ Mots de passe hashés avec bcrypt (10 rounds)
- ✅ Validation des entrées avec class-validator
- ✅ Protection CSRF via SameSite cookies
- ✅ Headers de sécurité HTTP (Helmet)
- ✅ Rate limiting
- ✅ Protection IDOR
- ✅ Rôles utilisateurs (USER, ADMIN)
- ✅ Validation des mots de passe robustes (12+ caractères, 3/4 critères)
- ✅ Pas de secrets en clair dans le code
- ✅ Logs d'erreurs configurés pour la production
- ✅ Protection contre les injections SQL (TypeORM avec requêtes préparées)
- ✅ Protection XSS (échappement automatique)

### Audit de sécurité

```bash
npm audit
```

## 📚 API Endpoints

### Authentification

- `POST /auth/register` - Inscription
  - Body: `{ email, name, password, consentGiven }`
  - Password: minimum 12 caractères, 3/4 critères (maj, min, chiffres, spéciaux)
- `POST /auth/login` - Connexion
  - Body: `{ email, password }`
  - Retourne un cookie `access_token` HttpOnly
- `POST /auth/logout` - Déconnexion

### Articles (Posts)

- `GET /posts` - Liste des articles (public)
- `GET /posts/:id` - Détails d'un article (public)
- `POST /posts` - Créer un article (authentifié)
  - Body: `{ title, content, imageUrl? }`
- `PATCH /posts/:id` - Modifier un article (auteur ou admin)
- `DELETE /posts/:id` - Supprimer un article (auteur ou admin)

### Commentaires

- `POST /posts/:postId/comments` - Ajouter un commentaire (authentifié)
  - Body: `{ content }`
- `GET /posts/:postId/comments/:id` - Voir un commentaire (public)
- `DELETE /posts/:postId/comments/:id` - Supprimer un commentaire (auteur ou admin)

### Utilisateurs

- `GET /users` - Liste des utilisateurs (admin uniquement)
- `GET /users/:id` - Profil utilisateur (soi-même ou admin)
- `PATCH /users/:id` - Modifier le profil (soi-même ou admin)

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 🐳 Docker

```bash
# Build
docker build -t blog-api .

# Run
docker run -p 4000:4000 --env-file .env blog-api
```

## 📝 Documentation

La documentation complète de l'API est disponible dans le code source avec des commentaires détaillés sur les parties sensibles.

### Checklist de sécurité implémentée

Voir la checklist complète de sécurité dans le fichier de spécifications du projet. Toutes les fonctionnalités de sécurité requises ont été implémentées.

## 📄 License

UNLICENSED
