# 🚀 PaceMate - Production Ready

## ✨ Version 3.0.0 - Full Stack

PaceMate est maintenant une application **full-stack production-ready** avec backend Node.js, base de données MongoDB, et fonctionnalités multijoueurs en temps réel !

## 🎯 Ce qui a été ajouté

### 🔧 Backend Complet

- ✅ **Serveur Express.js** avec architecture REST
- ✅ **MongoDB** avec Mongoose (5 modèles)
- ✅ **Authentification JWT** sécurisée
- ✅ **Socket.IO** pour le temps réel
- ✅ **7 endpoints API** complets

### 🌐 APIs Disponibles

1. **Auth** (`/api/auth`) - Inscription, connexion, vérification
2. **Users** (`/api/users`) - Profils, amis, recherche, position
3. **Runs** (`/api/runs`) - Courses, stats, fil d'actualité
4. **Challenges** (`/api/challenges`) - Défis, progression
5. **Leaderboard** (`/api/leaderboard`) - Classements global/local/amis
6. **Games** (`/api/games`) - Mini-jeux multijoueurs
7. **Routes** (`/api/routes`) - Itinéraires sauvegardés

### 🔌 Temps Réel (WebSocket)

- Position des coureurs en direct
- Mini-jeux multijoueurs synchronisés
- Chat instantané
- Notifications push
- Statut en ligne/hors ligne

### 🐳 Déploiement

- **Docker** : Dockerfile + docker-compose.yml
- **Nginx** : Configuration proxy inverse
- **Variables d'environnement** : .env configuré
- **CI/CD Ready** : Scripts de build

### 📚 Documentation

- 📖 `DEPLOIEMENT.md` - Guide complet de déploiement
- 📖 `API_DOCUMENTATION.md` - Documentation API détaillée
- 📖 `ARCHITECTURE.md` - Architecture technique
- 📖 `CHANGELOG.md` - Historique des versions

## 🚀 Démarrage Rapide

### Option 1 : Développement Local

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 3. Lancer MongoDB (si local)
mongod

# 4. Lancer le serveur en mode dev
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

### Option 2 : Docker (Recommandé)

```bash
# 1. Configurer l'environnement
cp .env.example .env
# Éditer .env

# 2. Lancer avec Docker Compose
docker-compose up -d

# 3. Voir les logs
docker-compose logs -f

# 4. Arrêter
docker-compose down
```

### Option 3 : Production

```bash
# 1. Build de production
npm install --production
npm run build:client

# 2. Lancer
npm start
```

## 📋 Variables d'Environnement

Créez un fichier `.env` :

```env
# Serveur
PORT=3000
NODE_ENV=production

# MongoDB (utiliser MongoDB Atlas en production)
MONGODB_URI=mongodb://localhost:27017/pacemate

# JWT (CHANGER EN PRODUCTION !)
JWT_SECRET=votre_secret_ultra_securise

# Client
CLIENT_URL=http://localhost:3000
```

## 🔐 Sécurité

### ⚠️ IMPORTANT - Avant de déployer :

1. **Changez le JWT_SECRET** :
   ```bash
   openssl rand -base64 64
   ```

2. **Utilisez MongoDB Atlas** (pas de MongoDB local)

3. **Activez HTTPS** (Let's Encrypt recommandé)

4. **Vérifiez les variables d'environnement**

## 🧪 Tests

```bash
# Lancer tous les tests Cypress
npm test

# Tests en mode interactif
npm run test:open

# Tests spécifiques
npm run test:spec cypress/e2e/mini-games.cy.js
```

## 📦 Structure du Projet

```
pacemate/
├── api/                   # Backend
│   ├── middleware/        # JWT, etc.
│   ├── models/            # MongoDB models
│   └── routes/            # API routes
├── public/                # Frontend (build)
├── cypress/               # Tests E2E
├── server.js              # Serveur principal
├── Dockerfile             # Image Docker
├── docker-compose.yml     # Orchestration
└── *.md                   # Documentation
```

## 🌟 Fonctionnalités Complètes

### Frontend
- ✅ Carte interactive avancée
- ✅ 6 mini-jeux multijoueurs
- ✅ Planificateur d'itinéraire
- ✅ Gamification (XP, niveaux, badges)
- ✅ Social (amis, chat, classements)
- ✅ PWA Support

### Backend
- ✅ API REST complète
- ✅ WebSocket temps réel
- ✅ Authentification JWT
- ✅ Base de données MongoDB
- ✅ Rate limiting
- ✅ Sécurité (Helmet, CORS)

## 📊 Endpoints API

### Exemples

```bash
# Inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"runner","email":"user@example.com","password":"pass123"}'

# Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Obtenir son profil (avec token)
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Voir `API_DOCUMENTATION.md` pour la documentation complète.

## 🚢 Déploiement Cloud

### Heroku

```bash
heroku create pacemate-app
heroku addons:create mongolab:sandbox
heroku config:set JWT_SECRET=votre_secret
git push heroku main
```

### Railway

```bash
railway init
railway up
```

### Render

1. Connectez votre repo GitHub
2. Créez un Web Service
3. Build : `npm install && npm run build:client`
4. Start : `npm start`
5. Ajoutez les variables d'environnement

Voir `DEPLOIEMENT.md` pour plus de détails.

## 🔧 Scripts npm

| Commande | Description |
|----------|-------------|
| `npm run dev` | Développement (nodemon) |
| `npm start` | Production |
| `npm run build:client` | Build frontend |
| `npm test` | Tests Cypress |
| `npm run test:open` | Tests interactifs |

## 📈 Monitoring

### Health Check

```bash
curl http://localhost:3000/health
```

Réponse :
```json
{
  "status": "ok",
  "timestamp": "2026-01-22T10:00:00.000Z",
  "uptime": 3600
}
```

### Logs

```bash
# Docker
docker-compose logs -f

# PM2 (production)
pm2 logs pacemate
```

## 🆘 Dépannage

### L'application ne démarre pas

```bash
# Vérifier MongoDB
mongosh

# Vérifier les variables d'env
cat .env

# Vérifier les logs
npm start
```

### Erreur de connexion MongoDB

- Vérifiez que MongoDB est démarré
- Vérifiez l'URI dans `.env`
- Sur Atlas, vérifiez la whitelist IP

### Socket.IO ne fonctionne pas

- Vérifiez CORS dans `.env`
- Vérifiez la configuration Nginx
- Vérifiez les ports ouverts

## 📞 Support

- **Documentation** : Voir les fichiers `*.md`
- **Issues** : [GitHub Issues](https://github.com)
- **Email** : support@pacemate.app

## 🎉 Migration depuis v2.x

Si vous utilisez PaceMate v2.x (frontend only) :

1. **Sauvegarder vos données** (LocalStorage)
2. **Installer les nouvelles dépendances** : `npm install`
3. **Configurer MongoDB** (local ou Atlas)
4. **Créer le fichier `.env`**
5. **Migrer les données** (script à venir)
6. **Lancer le backend** : `npm start`

## 📝 Checklist Déploiement

Avant de mettre en production :

- [ ] Variables d'environnement configurées
- [ ] JWT_SECRET changé
- [ ] MongoDB Atlas configuré
- [ ] HTTPS activé
- [ ] Tests passent
- [ ] Monitoring en place
- [ ] Sauvegardes configurées

## 🏆 Crédits

Développé avec ❤️ par l'équipe PaceMate

## 📄 Licence

MIT License - Voir LICENSE pour plus de détails

---

**Version** : 3.0.0  
**Date** : Janvier 2026  
**Status** : Production Ready ✅

