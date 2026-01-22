# 🏃‍♂️ PaceMate

<div align="center">

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**Application de running sociale révolutionnaire avec carte interactive, mini-jeux multijoueurs et gamification**

[🚀 Démo](#demo) • [✨ Fonctionnalités](#fonctionnalités) • [📦 Installation](#installation) • [📖 Documentation](#documentation) • [🤝 Contribuer](#contribuer)

</div>

---

## 🎯 À Propos

PaceMate est une **application full-stack moderne** qui transforme la course à pied en une expérience sociale et ludique. Trouvez des partenaires de course près de chez vous, participez à des mini-jeux en temps réel, et progressez grâce à un système de gamification complet.

### 🌟 Pourquoi PaceMate ?

- 🗺️ **Carte Interactive** : Visualisez les coureurs autour de vous en temps réel
- 🎮 **6 Mini-Jeux** : Capture de zones, courses aux checkpoints, chasse au trésor...
- 🏆 **Gamification** : XP, niveaux, badges, boutique virtuelle
- 👥 **Social** : Amis, chat, classements globaux et locaux
- 📍 **Planificateur** : Créez et partagez vos itinéraires
- 🔄 **Temps Réel** : Synchronisation multijoueur avec Socket.IO

---

## ✨ Fonctionnalités

### 🗺️ Carte Interactive Avancée

- Localisation GPS en temps réel
- 6 styles de carte (Standard, Satellite, Sombre, Terrain, Aquarelle, Bande dessinée)
- Mesure de distance
- Heatmap d'activité
- Filtres avancés (coureurs, zones, POI)
- Mode plein écran
- 🛤️ **Parcours sécurisés** : Pistes officielles certifiées et sécurisées
  - Pistes athlétiques homologuées
  - Parcs urbains avec chemins balisés
  - Circuits urbains sécurisés
  - Sentiers nature certifiés
  - Parcours côtiers
  - Critères de sécurité (éclairage, surveillance, accessibilité PMR)

### 🎮 Mini-Jeux Multijoueurs

1. **Capture de Zones** - Territorial control (solo/équipe)
2. **Course aux Checkpoints** - Race contre la montre
3. **Roi de la Colline** - Contrôle de zone centrale
4. **Chasse au Trésor** - Trésors cachés
5. **Relais par Équipe** - Collaboration
6. **Défense de Zone** - Stratégie et power-ups

### 🏆 Système de Gamification

- 💎 **100 niveaux** de progression
- ⭐ **XP** gagnée en courant
- 💰 **Pièces virtuelles** pour acheter des items
- 🎖️ **12 badges** à débloquer
- 🏪 **Boutique** avec avatars, power-ups, styles

### 👥 Fonctionnalités Sociales

- 📊 **3 classements** : Global, Local, Amis
- 👫 **Système d'amis** complet
- 💬 **Chat en temps réel**
- 🔔 **Notifications** instantanées
- 📈 **Profils** avec statistiques

### 📍 Planificateur d'Itinéraire

- Création d'itinéraires A → B
- Points de passage draggables
- Calcul distance/temps/calories
- Sauvegarde et partage
- Mode navigation

---

## 🏗️ Architecture

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)**
- **Leaflet.js** pour les cartes
- **Responsive Design**
- **PWA Support**

### Backend
- **Node.js + Express**
- **MongoDB + Mongoose**
- **Socket.IO** (temps réel)
- **JWT** (authentification)

### Déploiement
- **Docker & Docker Compose**
- **Nginx** (proxy inverse)
- **CI/CD** ready

---

## 📦 Installation

### Prérequis

- Node.js >= 18.0.0
- MongoDB >= 7.0
- npm >= 9.0.0

### Installation Rapide

```bash
# Cloner le dépôt
git clone https://github.com/JOhn12345re/PaceMate.git
cd PaceMate

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Lancer le serveur
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

### 🐳 Avec Docker

```bash
# Configuration
cp .env.example .env

# Lancer
docker-compose up -d

# Logs
docker-compose logs -f
```

---

## 🚀 Démarrage

### Mode Développement

```bash
npm run dev
```

### Mode Production

```bash
npm start
```

### Tests

```bash
# Tous les tests Cypress
npm test

# Mode interactif
npm run test:open

# Test spécifique
npm run test:spec cypress/e2e/mini-games.cy.js
```

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [📘 API Documentation](API_DOCUMENTATION.md) | API REST complète |
| [🚀 Déploiement](DEPLOIEMENT.md) | Guide de déploiement |
| [🏗️ Architecture](ARCHITECTURE.md) | Architecture technique |
| [🎮 Mini-Jeux](GUIDE_MINI-JEUX.md) | Guide des mini-jeux |
| [🗺️ Carte Avancée](GUIDE_CARTE_AVANCEE.md) | Fonctionnalités carte |
| [📍 Itinéraire](GUIDE_ITINERAIRE.md) | Planificateur d'itinéraire |
| [🐰 CodeRabbit](CODERABBIT_GUIDE.md) | Qualité du code |
| [🧪 Tests](README_TESTS.md) | Guide des tests |

---

## 🛠️ Stack Technique

### Dependencies

```json
{
  "express": "^4.18.2",
  "socket.io": "^4.6.0",
  "mongoose": "^8.0.3",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "helmet": "^7.1.0",
  "cors": "^2.8.5"
}
```

### DevDependencies

```json
{
  "cypress": "^13.6.0",
  "eslint": "^8.56.0",
  "nodemon": "^3.0.2"
}
```

---

## 📊 Endpoints API

### Authentification
```
POST   /api/auth/register    Inscription
POST   /api/auth/login       Connexion
GET    /api/auth/verify      Vérifier token
```

### Utilisateurs
```
GET    /api/users/me         Profil
PATCH  /api/users/me         Modifier profil
GET    /api/users/nearby     Utilisateurs proches
POST   /api/users/location   Mettre à jour position
```

### Courses
```
POST   /api/runs             Créer course
GET    /api/runs/my          Mes courses
GET    /api/runs/feed        Fil d'actualité
```

### Mini-Jeux
```
POST   /api/games            Créer jeu
GET    /api/games/available  Jeux disponibles
POST   /api/games/:id/join   Rejoindre
POST   /api/games/:id/capture Capturer zone
```

[📖 Documentation API complète](API_DOCUMENTATION.md)

---

## 🧪 Tests

Suite de tests Cypress complète :

- ✅ Navigation
- ✅ Carte interactive
- ✅ Planificateur d'itinéraire
- ✅ Gamification
- ✅ Mini-jeux
- ✅ Classements
- ✅ Responsive
- ✅ Performance

```bash
npm test
```

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! 🎉

### Workflow

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez (`git commit -m 'feat: Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Guidelines

- Suivez les conventions de code (ESLint)
- Ajoutez des tests
- Mettez à jour la documentation
- Utilisez des commits conventionnels

[📋 Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md)

---

## 🐛 Rapporter un Bug

Utilisez notre [template de bug report](.github/ISSUE_TEMPLATE/bug_report.md)

---

## 💡 Demander une Fonctionnalité

Utilisez notre [template de feature request](.github/ISSUE_TEMPLATE/feature_request.md)

---

## 📝 Changelog

Voir [CHANGELOG.md](CHANGELOG.md) pour l'historique détaillé.

### Version 3.0.0 (Actuelle)

- 🚀 Backend Node.js complet
- 🔌 WebSocket temps réel
- 🐳 Docker & Docker Compose
- 📚 Documentation complète
- 🐰 CodeRabbit intégré

---

## 📜 Licence

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus de détails.

---

## 👥 Équipe

Développé avec ❤️ par l'équipe PaceMate

---

## 🙏 Remerciements

- [Leaflet.js](https://leafletjs.com/) - Cartes interactives
- [Socket.IO](https://socket.io/) - WebSocket temps réel
- [Express](https://expressjs.com/) - Framework Node.js
- [MongoDB](https://www.mongodb.com/) - Base de données
- [Cypress](https://www.cypress.io/) - Tests E2E

---

## 📞 Contact

- **GitHub Issues** : [Issues](https://github.com/JOhn12345re/PaceMate/issues)
- **Email** : support@pacemate.app
- **Documentation** : [Docs](https://github.com/JOhn12345re/PaceMate/wiki)

---

<div align="center">

**⭐ Si vous aimez PaceMate, n'oubliez pas de mettre une étoile ! ⭐**

Made with ❤️ and ☕

</div>

