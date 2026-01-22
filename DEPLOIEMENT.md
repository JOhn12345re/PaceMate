# 🚀 Guide de Déploiement - PaceMate

Ce guide vous explique comment déployer PaceMate en production.

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Déploiement Local](#déploiement-local)
3. [Déploiement avec Docker](#déploiement-avec-docker)
4. [Déploiement Cloud](#déploiement-cloud)
5. [Configuration](#configuration)
6. [Sécurité](#sécurité)
7. [Monitoring](#monitoring)

## ⚙️ Prérequis

### Logiciels requis

- **Node.js** >= 18.0.0
- **MongoDB** >= 7.0
- **npm** >= 9.0.0
- **Docker** (optionnel, pour déploiement conteneurisé)

### Comptes nécessaires

- Compte MongoDB Atlas (pour base de données cloud)
- Compte Heroku/Railway/Render (pour hébergement)
- Compte Cloudflare (optionnel, pour CDN)

## 💻 Déploiement Local

### 1. Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-compte/pacemate.git
cd pacemate

# Installer les dépendances
npm install
```

### 2. Configuration

Créez un fichier `.env` à la racine du projet :

```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/pacemate
JWT_SECRET=votre_secret_jwt_ultra_securise
CLIENT_URL=http://localhost:3000
```

### 3. Préparation de la production

```bash
# Construire les assets optimisés
npm run build:client

# Copier les fichiers dans public/
cp index.html public/
cp styles.css public/
cp app.js public/
```

### 4. Lancement

```bash
# Mode développement (avec hot-reload)
npm run dev

# Mode production
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🐳 Déploiement avec Docker

### Option 1 : Docker Compose (Recommandé)

```bash
# Créer le fichier .env
cp .env.example .env

# Éditer .env avec vos valeurs
nano .env

# Démarrer tous les services
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

### Option 2 : Docker seul

```bash
# Construire l'image
docker build -t pacemate:latest .

# Lancer MongoDB
docker run -d --name pacemate-mongo \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:7.0

# Lancer l'application
docker run -d --name pacemate-app \
  -p 3000:3000 \
  --link pacemate-mongo:mongo \
  -e MONGODB_URI=mongodb://mongo:27017/pacemate \
  -e JWT_SECRET=votre_secret \
  pacemate:latest
```

## ☁️ Déploiement Cloud

### Heroku

```bash
# Installer Heroku CLI
npm install -g heroku

# Se connecter
heroku login

# Créer l'application
heroku create pacemate-app

# Ajouter MongoDB
heroku addons:create mongolab:sandbox

# Configurer les variables d'environnement
heroku config:set JWT_SECRET=votre_secret_jwt
heroku config:set NODE_ENV=production

# Déployer
git push heroku main

# Ouvrir l'application
heroku open
```

### Railway

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Initialiser le projet
railway init

# Déployer
railway up
```

### Render

1. Connectez votre dépôt GitHub à Render
2. Créez un nouveau **Web Service**
3. Configurez :
   - **Build Command** : `npm install && npm run build:client`
   - **Start Command** : `npm start`
4. Ajoutez les variables d'environnement
5. Déployez !

### MongoDB Atlas (Base de données cloud)

```bash
# 1. Créer un compte sur MongoDB Atlas
# 2. Créer un cluster gratuit
# 3. Créer un utilisateur de base de données
# 4. Obtenir l'URI de connexion

# Exemple d'URI :
MONGODB_URI=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/pacemate?retryWrites=true&w=majority
```

## 🔧 Configuration

### Variables d'Environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `PORT` | Port du serveur | `3000` |
| `NODE_ENV` | Environnement | `production` |
| `MONGODB_URI` | URI MongoDB | `mongodb://localhost:27017/pacemate` |
| `JWT_SECRET` | Secret pour JWT | `secret_ultra_securise_123` |
| `CLIENT_URL` | URL du client | `https://pacemate.app` |
| `RATE_LIMIT_MAX_REQUESTS` | Limite de requêtes | `100` |

### Nginx (Proxy Inverse)

Si vous utilisez Nginx comme proxy inverse, le fichier `nginx.conf` est déjà configuré.

Pour l'activer avec Docker Compose :

```bash
docker-compose --profile production up -d
```

## 🔒 Sécurité

### Checklist de Sécurité

- [ ] Changer le `JWT_SECRET` avec une valeur forte et unique
- [ ] Activer HTTPS avec certificat SSL (Let's Encrypt recommandé)
- [ ] Configurer les en-têtes de sécurité (déjà fait dans Helmet)
- [ ] Activer le rate limiting
- [ ] Configurer CORS correctement
- [ ] Ne jamais commiter le fichier `.env`
- [ ] Utiliser des connexions MongoDB sécurisées
- [ ] Mettre à jour régulièrement les dépendances

### Génération d'un JWT Secret fort

```bash
# Linux/macOS
openssl rand -base64 64

# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

### HTTPS avec Let's Encrypt

```bash
# Installer Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtenir un certificat
sudo certbot --nginx -d pacemate.app -d www.pacemate.app

# Renouvellement automatique
sudo certbot renew --dry-run
```

## 📊 Monitoring

### Logs

```bash
# Docker Compose
docker-compose logs -f pacemate

# Docker seul
docker logs -f pacemate-app

# Heroku
heroku logs --tail

# Logs dans un fichier
npm start > logs/app.log 2>&1
```

### Health Check

L'application expose un endpoint `/health` :

```bash
curl http://localhost:3000/health
```

Réponse :

```json
{
  "status": "ok",
  "timestamp": "2026-01-22T10:30:00.000Z",
  "uptime": 3600
}
```

### Monitoring avec PM2

```bash
# Installer PM2
npm install -g pm2

# Démarrer l'application
pm2 start server.js --name pacemate

# Monitoring en temps réel
pm2 monit

# Logs
pm2 logs pacemate

# Redémarrage automatique
pm2 startup
pm2 save
```

## 🔄 Mise à Jour

```bash
# Arrêter l'application
pm2 stop pacemate  # ou docker-compose down

# Mettre à jour le code
git pull origin main

# Installer les nouvelles dépendances
npm install

# Reconstruire
npm run build:client

# Redémarrer
pm2 restart pacemate  # ou docker-compose up -d
```

## 🐛 Dépannage

### L'application ne démarre pas

```bash
# Vérifier les logs
npm start

# Vérifier MongoDB
mongosh
```

### Erreur de connexion MongoDB

- Vérifiez que MongoDB est démarré
- Vérifiez l'URI dans `.env`
- Vérifiez les autorisations réseau (whitelist IP sur Atlas)

### Socket.IO ne fonctionne pas

- Vérifiez la configuration CORS
- Vérifiez que le proxy (Nginx) supporte WebSocket
- Vérifiez les en-têtes `Upgrade` et `Connection`

### Erreur 502 Bad Gateway

- Vérifiez que l'application est démarrée
- Vérifiez les logs Nginx
- Vérifiez la configuration du proxy

## 📞 Support

Pour toute question ou problème :

- **Issues GitHub** : [github.com/votre-compte/pacemate/issues](https://github.com)
- **Email** : support@pacemate.app
- **Documentation** : Voir les autres fichiers `.md`

## 📝 Checklist de Déploiement

Avant de mettre en production :

- [ ] Tests passent (`npm test`)
- [ ] Variables d'environnement configurées
- [ ] JWT Secret généré et sécurisé
- [ ] MongoDB accessible et sécurisé
- [ ] HTTPS configuré
- [ ] Rate limiting activé
- [ ] Monitoring en place
- [ ] Sauvegardes configurées
- [ ] Documentation à jour

## 🎉 Félicitations !

Votre application PaceMate est maintenant en ligne ! 🚀

N'oubliez pas de surveiller les performances et les logs régulièrement.

