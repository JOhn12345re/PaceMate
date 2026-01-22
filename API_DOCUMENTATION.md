# 📖 Documentation API - PaceMate

## 🌐 URL de Base

```
Production: https://api.pacemate.app
Local: http://localhost:3000
```

## 🔐 Authentification

L'API utilise JSON Web Tokens (JWT) pour l'authentification.

### Format du Header

```
Authorization: Bearer <token>
```

### Obtenir un Token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "runner123",
    "profile": {...}
  }
}
```

---

## 📍 Endpoints

### 🔑 Authentification

#### Inscription

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "runner123",
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse (201 Created) :**
```json
{
  "message": "Inscription réussie",
  "token": "eyJhbGciOiJIUz...",
  "user": {...}
}
```

#### Connexion

```http
POST /api/auth/login
```

#### Déconnexion

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### Vérifier un Token

```http
GET /api/auth/verify
Authorization: Bearer <token>
```

---

### 👤 Utilisateurs

#### Obtenir son Profil

```http
GET /api/users/me
Authorization: Bearer <token>
```

#### Mettre à Jour son Profil

```http
PATCH /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "profile": {
    "avatar": "🏃"
  },
  "settings": {
    "privacy": "public"
  }
}
```

#### Rechercher des Utilisateurs

```http
GET /api/users/search?q=runner&limit=20
Authorization: Bearer <token>
```

#### Utilisateurs Proches

```http
GET /api/users/nearby?latitude=48.8566&longitude=2.3522&radius=5000
Authorization: Bearer <token>
```

#### Mettre à Jour sa Position

```http
POST /api/users/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 48.8566,
  "longitude": 2.3522
}
```

#### Demande d'Ami

```http
POST /api/users/friends/request/:userId
Authorization: Bearer <token>
```

#### Accepter une Demande d'Ami

```http
POST /api/users/friends/accept/:userId
Authorization: Bearer <token>
```

#### Liste d'Amis

```http
GET /api/users/friends
Authorization: Bearer <token>
```

---

### 🏃 Courses

#### Créer une Course

```http
POST /api/runs
Authorization: Bearer <token>
Content-Type: application/json

{
  "distance": 5000,
  "duration": 1800,
  "pace": 6,
  "averageSpeed": 10,
  "calories": 350,
  "startTime": "2026-01-22T10:00:00Z",
  "endTime": "2026-01-22T10:30:00Z",
  "route": {
    "type": "LineString",
    "coordinates": [[2.3522, 48.8566], [2.3530, 48.8570]]
  }
}
```

**Réponse (201 Created) :**
```json
{
  "message": "Course enregistrée",
  "run": {...},
  "rewards": {
    "xp": 50,
    "coins": 25,
    "leveledUp": false
  }
}
```

#### Mes Courses

```http
GET /api/runs/my?limit=20&skip=0&sort=-startTime
Authorization: Bearer <token>
```

#### Obtenir une Course

```http
GET /api/runs/:runId
Authorization: Bearer <token>
```

#### Fil d'Actualité

```http
GET /api/runs/feed?limit=20&skip=0
Authorization: Bearer <token>
```

#### Liker une Course

```http
POST /api/runs/:runId/like
Authorization: Bearer <token>
```

#### Commenter une Course

```http
POST /api/runs/:runId/comment
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Belle course ! 🔥"
}
```

#### Statistiques

```http
GET /api/runs/stats/summary
Authorization: Bearer <token>
```

---

### 🎯 Défis

#### Défis Actifs

```http
GET /api/challenges?type=daily
Authorization: Bearer <token>
```

**Paramètres :**
- `type` : `daily`, `weekly`, `special`, `community`

#### Rejoindre un Défi

```http
POST /api/challenges/:challengeId/join
Authorization: Bearer <token>
```

#### Mettre à Jour la Progression

```http
POST /api/challenges/:challengeId/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "progress": 5000
}
```

#### Défis Complétés

```http
GET /api/challenges/completed
Authorization: Bearer <token>
```

---

### 🏆 Classements

#### Classement Global

```http
GET /api/leaderboard/global?period=allTime&limit=50
Authorization: Bearer <token>
```

**Paramètres :**
- `period` : `allTime`, `week`
- `limit` : nombre de résultats (défaut: 50)

**Réponse :**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "user": {
        "id": "...",
        "username": "speedrunner",
        "profile": {...}
      },
      "stats": {
        "distance": 150000,
        "runs": 45
      }
    }
  ],
  "period": "allTime"
}
```

#### Classement Local

```http
GET /api/leaderboard/local?latitude=48.8566&longitude=2.3522&radius=10000&limit=50
Authorization: Bearer <token>
```

#### Classement des Amis

```http
GET /api/leaderboard/friends
Authorization: Bearer <token>
```

#### Mon Rang

```http
GET /api/leaderboard/my-rank
Authorization: Bearer <token>
```

**Réponse :**
```json
{
  "rank": 42,
  "totalUsers": 1000,
  "percentile": "95.8"
}
```

---

### 🎮 Mini-Jeux

#### Créer un Jeu

```http
POST /api/games
Authorization: Bearer <token>
Content-Type: application/json

{
  "gameType": "capture-de-zones",
  "mode": "team",
  "settings": {
    "duration": 1800000,
    "maxPlayers": 10,
    "area": {
      "center": {
        "type": "Point",
        "coordinates": [2.3522, 48.8566]
      },
      "radius": 1000
    }
  },
  "zones": [...]
}
```

#### Jeux Disponibles

```http
GET /api/games/available?gameType=capture-de-zones&latitude=48.8566&longitude=2.3522&radius=5000
Authorization: Bearer <token>
```

#### Rejoindre un Jeu

```http
POST /api/games/:gameId/join
Authorization: Bearer <token>
Content-Type: application/json

{
  "team": "red"
}
```

#### Démarrer un Jeu

```http
POST /api/games/:gameId/start
Authorization: Bearer <token>
```

#### Capturer une Zone

```http
POST /api/games/:gameId/capture
Authorization: Bearer <token>
Content-Type: application/json

{
  "zoneId": "zone_001"
}
```

#### Atteindre un Checkpoint

```http
POST /api/games/:gameId/checkpoint
Authorization: Bearer <token>
Content-Type: application/json

{
  "checkpointId": "cp_001",
  "time": 120
}
```

#### Terminer un Jeu

```http
POST /api/games/:gameId/end
Authorization: Bearer <token>
```

#### Historique des Jeux

```http
GET /api/games/history?limit=20
Authorization: Bearer <token>
```

---

### 🗺️ Itinéraires

#### Sauvegarder un Itinéraire

```http
POST /api/routes
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Tour du Parc",
  "description": "Boucle autour du parc",
  "start": {
    "type": "Point",
    "coordinates": [2.3522, 48.8566],
    "address": "1 Rue de Rivoli, Paris"
  },
  "end": {
    "type": "Point",
    "coordinates": [2.3530, 48.8570],
    "address": "10 Avenue des Champs-Élysées"
  },
  "waypoints": [...],
  "distance": 5000,
  "estimatedTime": 1800,
  "difficulty": "moyen",
  "isPublic": true
}
```

#### Mes Itinéraires

```http
GET /api/routes/my?limit=20&skip=0
Authorization: Bearer <token>
```

#### Obtenir un Itinéraire

```http
GET /api/routes/:routeId
Authorization: Bearer <token>
```

#### Rechercher des Itinéraires Publics

```http
GET /api/routes/search/public?latitude=48.8566&longitude=2.3522&radius=10000&difficulty=moyen&terrain=route
Authorization: Bearer <token>
```

#### Mettre à Jour un Itinéraire

```http
PATCH /api/routes/:routeId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nouveau nom",
  "isPublic": false
}
```

#### Supprimer un Itinéraire

```http
DELETE /api/routes/:routeId
Authorization: Bearer <token>
```

#### Liker un Itinéraire

```http
POST /api/routes/:routeId/like
Authorization: Bearer <token>
```

#### Utiliser un Itinéraire

```http
POST /api/routes/:routeId/use
Authorization: Bearer <token>
```

---

## 🔌 WebSocket (Socket.IO)

### Connexion

```javascript
const socket = io('https://api.pacemate.app');

// Authentification
socket.emit('authenticate', 'votre_jwt_token');

socket.on('authenticated', (data) => {
  console.log('Authentifié:', data);
});
```

### Événements Émis par le Client

#### Position en Temps Réel

```javascript
socket.emit('location:update', {
  position: { lat: 48.8566, lng: 2.3522 },
  speed: 10
});
```

#### Rejoindre un Jeu

```javascript
socket.emit('game:join', 'game_id_123');
```

#### Capturer une Zone

```javascript
socket.emit('game:capture', {
  gameId: 'game_id_123',
  zoneId: 'zone_001',
  team: 'red'
});
```

#### Chat

```javascript
socket.emit('chat:message', {
  recipientId: 'user_id_456',
  message: 'Salut !'
});
```

### Événements Reçus par le Client

#### Joueur en Mouvement

```javascript
socket.on('runner:moved', (data) => {
  console.log('Joueur déplacé:', data);
  // { userId, position, speed }
});
```

#### Zone Capturée

```javascript
socket.on('zone:captured', (data) => {
  console.log('Zone capturée:', data);
  // { zoneId, userId, team, timestamp }
});
```

#### Message Reçu

```javascript
socket.on('chat:message', (data) => {
  console.log('Message:', data);
  // { from, message, timestamp }
});
```

#### Utilisateur En Ligne

```javascript
socket.on('user:online', (data) => {
  console.log('Utilisateur en ligne:', data.userId);
});
```

---

## 📊 Codes de Statut HTTP

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Créé |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Accès refusé |
| 404 | Non trouvé |
| 429 | Trop de requêtes |
| 500 | Erreur serveur |

## ⚠️ Erreurs

Format des erreurs :

```json
{
  "error": {
    "message": "Description de l'erreur",
    "status": 400
  }
}
```

## 🚦 Rate Limiting

- **Limite** : 100 requêtes par 15 minutes par IP
- **Header de réponse** : `X-RateLimit-Remaining`

## 📝 Notes

- Toutes les dates sont au format ISO 8601
- Les coordonnées géographiques sont au format `[longitude, latitude]`
- Les distances sont en mètres
- Les durées sont en millisecondes
- Les paces sont en min/km

## 🔗 Exemples de Client

### JavaScript (Fetch)

```javascript
const API_URL = 'http://localhost:3000/api';
const token = localStorage.getItem('token');

async function getMeRuns() {
  const response = await fetch(`${API_URL}/runs/my`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
}
```

### cURL

```bash
curl -X GET \
  http://localhost:3000/api/users/me \
  -H 'Authorization: Bearer eyJhbGciOiJIUz...'
```

## 📞 Support

Pour toute question sur l'API :

- **Documentation** : https://docs.pacemate.app
- **Email** : api@pacemate.app
- **GitHub Issues** : https://github.com/pacemate/issues

