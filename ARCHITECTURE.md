# 🏗️ Architecture - PaceMate

## 📐 Vue d'Ensemble

PaceMate est une application full-stack avec :
- **Frontend** : Vanilla JavaScript, HTML5, CSS3
- **Backend** : Node.js + Express
- **Base de données** : MongoDB
- **Temps réel** : Socket.IO
- **Authentification** : JWT

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   HTML5    │  │   CSS3     │  │ JavaScript │            │
│  │            │  │            │  │   (ES6+)   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│         │                │               │                   │
│         └────────────────┴───────────────┘                   │
│                       │                                      │
│              ┌────────▼────────┐                            │
│              │   Leaflet.js    │                            │
│              │   (Cartes)      │                            │
│              └─────────────────┘                            │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ HTTP / WebSocket
                         │
┌─────────────────────────▼───────────────────────────────────┐
│                        BACKEND                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Express.js                         │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │  REST API   │  │  Middleware  │  │  Socket.IO  │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│              ┌──────────┴──────────┐                        │
│              │                     │                        │
│         ┌────▼────┐          ┌────▼────┐                   │
│         │  Auth   │          │  Routes │                   │
│         │  (JWT)  │          │  /api/* │                   │
│         └─────────┘          └─────────┘                   │
└─────────────────────────────────────────────────────────────┘
                         │
                         │
┌─────────────────────────▼───────────────────────────────────┐
│                      BASE DE DONNÉES                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                     MongoDB                           │  │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  │  │
│  │  │Users │  │ Runs │  │Games │  │Routes│  │Chall.│  │  │
│  │  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🗂️ Structure des Dossiers

```
pacemate/
├── 📁 api/                          # Backend API
│   ├── 📁 middleware/               # Middleware Express
│   │   └── auth.js                  # Authentification JWT
│   ├── 📁 models/                   # Modèles MongoDB
│   │   ├── User.js                  # Utilisateur
│   │   ├── Run.js                   # Course
│   │   ├── Game.js                  # Mini-jeu
│   │   └── Challenge.js             # Défi
│   └── 📁 routes/                   # Routes API
│       ├── auth.js                  # /api/auth
│       ├── users.js                 # /api/users
│       ├── runs.js                  # /api/runs
│       ├── games.js                 # /api/games
│       ├── challenges.js            # /api/challenges
│       ├── leaderboard.js           # /api/leaderboard
│       └── routes.js                # /api/routes
│
├── 📁 public/                       # Frontend (production)
│   ├── index.html                   # HTML optimisé
│   ├── styles.min.css               # CSS minifié
│   ├── app.min.js                   # JS minifié
│   └── manifest.json                # PWA manifest
│
├── 📁 cypress/                      # Tests E2E
│   ├── 📁 e2e/                      # Tests
│   ├── 📁 support/                  # Support Cypress
│   └── 📁 fixtures/                 # Données de test
│
├── 📄 server.js                     # Serveur principal
├── 📄 index.html                    # HTML source
├── 📄 styles.css                    # CSS source
├── 📄 app.js                        # JavaScript source
├── 📄 package.json                  # Dépendances
├── 📄 Dockerfile                    # Image Docker
├── 📄 docker-compose.yml            # Orchestration Docker
├── 📄 nginx.conf                    # Configuration Nginx
├── 📄 .env.example                  # Variables d'env (exemple)
└── 📄 *.md                          # Documentation
```

## 🎯 Flux de Données

### 1. Authentification

```
┌─────────┐                ┌─────────┐                ┌──────────┐
│ Client  │                │ Backend │                │ MongoDB  │
└────┬────┘                └────┬────┘                └────┬─────┘
     │                          │                          │
     │  POST /api/auth/login    │                          │
     ├─────────────────────────>│                          │
     │                          │   findOne(email)         │
     │                          ├─────────────────────────>│
     │                          │<─────────────────────────┤
     │                          │   user data              │
     │                          │                          │
     │                          │  comparePassword()       │
     │                          │  generateJWT()           │
     │                          │                          │
     │  token + user data       │                          │
     │<─────────────────────────┤                          │
     │                          │                          │
     │  Future requests         │                          │
     │  Authorization: Bearer   │                          │
     │  <token>                 │                          │
     ├─────────────────────────>│                          │
```

### 2. Enregistrement d'une Course

```
┌─────────┐                ┌─────────┐                ┌──────────┐
│ Client  │                │ Backend │                │ MongoDB  │
└────┬────┘                └────┬────┘                └────┬─────┘
     │                          │                          │
     │  POST /api/runs          │                          │
     │  + run data              │                          │
     ├─────────────────────────>│                          │
     │                          │  authenticate()          │
     │                          │  create Run              │
     │                          ├─────────────────────────>│
     │                          │<─────────────────────────┤
     │                          │                          │
     │                          │  update User stats       │
     │                          ├─────────────────────────>│
     │                          │<─────────────────────────┤
     │                          │                          │
     │                          │  calculate rewards       │
     │                          │  (XP, coins, level)      │
     │                          │                          │
     │  run + rewards           │                          │
     │<─────────────────────────┤                          │
```

### 3. Mini-Jeu Multijoueur (Temps Réel)

```
┌──────────┐        ┌──────────┐        ┌─────────┐        ┌──────────┐
│ Client A │        │ Client B │        │ Backend │        │ MongoDB  │
└────┬─────┘        └────┬─────┘        └────┬────┘        └────┬─────┘
     │                   │                   │                   │
     │ socket.connect()  │                   │                   │
     ├──────────────────────────────────────>│                   │
     │                   │                   │                   │
     │                   │ socket.connect()  │                   │
     │                   ├──────────────────>│                   │
     │                   │                   │                   │
     │ emit('game:join') │                   │                   │
     ├──────────────────────────────────────>│  update Game     │
     │                   │                   ├──────────────────>│
     │                   │                   │<──────────────────┤
     │                   │                   │                   │
     │                   │<──────────────────┤                   │
     │<──────────────────┤  broadcast        │                   │
     │  'game:player-joined'                 │                   │
     │                   │                   │                   │
     │emit('game:capture')                   │                   │
     ├──────────────────────────────────────>│  update zone     │
     │                   │                   ├──────────────────>│
     │                   │                   │<──────────────────┤
     │                   │                   │                   │
     │                   │<──────────────────┤                   │
     │<──────────────────┤  broadcast        │                   │
     │  'zone:captured'  │  'zone:captured'  │                   │
```

## 🔐 Sécurité

### Authentification JWT

```javascript
// 1. L'utilisateur se connecte
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// 2. Le serveur génère un token
const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// 3. Le client stocke le token
localStorage.setItem('token', token);

// 4. Le client envoie le token dans chaque requête
headers: {
  'Authorization': `Bearer ${token}`
}

// 5. Le middleware vérifie le token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;
```

### Middleware de Sécurité

- **Helmet** : Headers de sécurité HTTP
- **CORS** : Contrôle d'accès cross-origin
- **Rate Limiting** : Limite les requêtes (100/15min)
- **bcrypt** : Hash des mots de passe
- **JWT** : Tokens signés et expirables

## 📊 Modèles de Données

### User

```javascript
{
  _id: ObjectId,
  username: String,
  email: String (unique),
  password: String (hashed),
  profile: {
    avatar: String,
    level: Number,
    xp: Number,
    coins: Number,
    totalDistance: Number,
    totalRuns: Number,
    badges: [Badge]
  },
  friends: [ObjectId],
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  isOnline: Boolean
}
```

### Run

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  route: {
    type: "LineString",
    coordinates: [[lng, lat], ...]
  },
  distance: Number,
  duration: Number,
  pace: Number,
  startTime: Date,
  endTime: Date,
  xpEarned: Number,
  coinsEarned: Number
}
```

### Game

```javascript
{
  _id: ObjectId,
  gameType: String,
  mode: "solo" | "team",
  status: "waiting" | "active" | "completed",
  players: [{
    userId: ObjectId,
    team: String,
    score: Number
  }],
  zones: [Zone],
  scores: { red: Number, blue: Number },
  winner: Object
}
```

## 🔌 API WebSocket (Socket.IO)

### Événements

| Événement | Direction | Description |
|-----------|-----------|-------------|
| `authenticate` | Client → Server | Authentification |
| `location:update` | Client → Server | Position en temps réel |
| `runner:moved` | Server → Clients | Diffusion mouvement |
| `game:join` | Client → Server | Rejoindre un jeu |
| `game:capture` | Client → Server | Capturer une zone |
| `zone:captured` | Server → Clients | Zone capturée |
| `chat:message` | Bidirectionnel | Messages |
| `user:online` | Server → Clients | Statut en ligne |

## 🚀 Déploiement

### Production Stack

```
Internet
    │
    ▼
┌─────────────┐
│   Nginx     │  ← Proxy inverse, SSL, cache
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Node.js    │  ← Application Express
│  (PM2/Docker)│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  MongoDB    │  ← Base de données
│  (Atlas)    │
└─────────────┘
```

### Environnements

- **Développement** : `npm run dev` (nodemon)
- **Production** : `npm start` (node)
- **Docker** : `docker-compose up`
- **Cloud** : Heroku / Railway / Render

## 📈 Performance

### Optimisations Frontend

- Minification CSS/JS
- Compression Gzip
- Cache navigateur
- Lazy loading des images
- Service Worker (PWA)

### Optimisations Backend

- Compression des réponses
- Rate limiting
- Pagination des résultats
- Index MongoDB
- Cache Nginx

## 🧪 Tests

```
cypress/
├── e2e/
│   ├── navigation.cy.js       # Navigation
│   ├── interactive-map.cy.js  # Carte
│   ├── gamification.cy.js     # XP/Coins
│   ├── mini-games.cy.js       # Mini-jeux
│   └── ...
└── support/
    └── commands.js            # Commandes custom
```

## 📚 Documentation

- `README.md` : Vue d'ensemble
- `DEPLOIEMENT.md` : Guide de déploiement
- `API_DOCUMENTATION.md` : Documentation API
- `ARCHITECTURE.md` : Ce fichier
- `GUIDE_*.md` : Guides utilisateur

## 🔄 Cycle de Vie d'une Requête

1. **Client** envoie une requête HTTP
2. **Nginx** (optionnel) reçoit et route
3. **Express** reçoit la requête
4. **Middleware** authentification (JWT)
5. **Route handler** traite la requête
6. **MongoDB** lit/écrit les données
7. **Response** retourne au client

## 💡 Bonnes Pratiques

- ✅ Variables d'environnement pour la config
- ✅ Validation des données d'entrée
- ✅ Gestion des erreurs centralisée
- ✅ Logs structurés
- ✅ Tests automatisés
- ✅ Documentation à jour
- ✅ Code review
- ✅ CI/CD

---

**Maintenu par** : PaceMate Team  
**Dernière mise à jour** : Janvier 2026

