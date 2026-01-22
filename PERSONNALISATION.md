# 🎨 Guide de Personnalisation - PaceMate

## 🎯 Vue d'Ensemble

Ce guide t'explique comment **personnaliser** facilement ton application PaceMate sans casser le code !

## 🎨 1. Changer les Couleurs

### Palette Principale
Ouvre `styles.css` et modifie les lignes 7-15 :

```css
:root {
    --primary: #FF6B35;        /* Couleur principale (boutons, titres) */
    --primary-dark: #E65525;   /* Variation foncée */
    --secondary: #4ECDC4;      /* Couleur secondaire (accents) */
    --accent: #FFE66D;         /* Couleur d'accent (highlights) */
    --success: #06D6A0;        /* Couleur de succès (validations) */
    --danger: #EF476F;         /* Couleur de danger (alertes) */
    --dark: #1A1A2E;          /* Couleur sombre (texte) */
    --gray: #94A3B8;          /* Gris moyen */
    --gray-light: #E2E8F0;    /* Gris clair (backgrounds) */
    --white: #FFFFFF;         /* Blanc */
}
```

### 🌈 Exemples de Palettes Prêtes

#### Palette "Nuit Étoilée" (Sombre)
```css
--primary: #6C63FF;
--primary-dark: #5648D9;
--secondary: #00D9FF;
--accent: #FFB800;
--success: #00E676;
--danger: #FF5252;
--dark: #1E1E2E;
```

#### Palette "Nature" (Verte)
```css
--primary: #4CAF50;
--primary-dark: #388E3C;
--secondary: #8BC34A;
--accent: #FFEB3B;
--success: #4CAF50;
--danger: #F44336;
--dark: #1B5E20;
```

#### Palette "Océan" (Bleue)
```css
--primary: #2196F3;
--primary-dark: #1976D2;
--secondary: #03A9F4;
--accent: #FFC107;
--success: #00BCD4;
--danger: #F44336;
--dark: #0D47A1;
```

## 🗺️ 2. Changer la Position par Défaut

Ouvre `app.js`, ligne 8 :

```javascript
const CONFIG = {
    map: {
        defaultCenter: [48.8566, 2.3522], // Paris par défaut
        defaultZoom: 13,
        maxDistance: 50 // km
    },
    // ...
};
```

### 🌍 Coordonnées de Villes Populaires

```javascript
// France
[48.8566, 2.3522]  // Paris
[43.2965, 5.3698]  // Marseille
[45.7640, 4.8357]  // Lyon
[43.6108, 3.8767]  // Montpellier
[44.8378, -0.5792] // Bordeaux

// Monde
[51.5074, -0.1278]  // Londres
[40.7128, -74.0060] // New York
[35.6762, 139.6503] // Tokyo
[34.0522, -118.2437] // Los Angeles
[-33.8688, 151.2093] // Sydney
```

## 🎮 3. Modifier le Système d'XP

Ouvre `app.js`, ligne 12 :

```javascript
xp: {
    baseXP: 100,           // XP nécessaire pour niveau 2
    levelMultiplier: 1.5   // Chaque niveau = précédent × 1.5
}
```

### Exemples de Progressions

#### Progression Rapide (Casual)
```javascript
baseXP: 50,
levelMultiplier: 1.3
// Niveaux : 50, 65, 85, 110, 143...
```

#### Progression Normale (Défaut)
```javascript
baseXP: 100,
levelMultiplier: 1.5
// Niveaux : 100, 150, 225, 337, 506...
```

#### Progression Difficile (Hardcore)
```javascript
baseXP: 200,
levelMultiplier: 2.0
// Niveaux : 200, 400, 800, 1600, 3200...
```

## 🎯 4. Ajouter des Défis Personnalisés

Ouvre `app.js`, trouve la fonction `generateInitialData()` (ligne ~300) :

### Ajouter un Défi Quotidien

```javascript
APP_STATE.challenges.daily.push({
    id: 'daily_custom1',              // ID unique
    icon: '🌟',                       // Emoji du défi
    title: 'Sprint Matinal',          // Titre
    description: 'Courir 3 km avant 9h',  // Description
    type: 'distance',                 // Type: distance, time, pace, social, ranking
    target: 3,                        // Objectif
    progress: 0,                      // Progression initiale
    reward: { xp: 60, coins: 30 },   // Récompenses
    completed: false                  // État
});
```

### Ajouter un Défi Hebdomadaire

```javascript
APP_STATE.challenges.weekly.push({
    id: 'weekly_custom1',
    icon: '🏔️',
    title: 'Grimpeur de Sommets',
    description: 'Courir 100 km de dénivelé cette semaine',
    type: 'elevation',
    target: 100,
    progress: 0,
    reward: { xp: 300, coins: 150 },
    completed: false
});
```

### 🎁 Idées de Défis

```javascript
// Défi de Vitesse
{
    icon: '⚡',
    title: 'Flash',
    description: 'Courir 5 km en moins de 25 minutes',
    target: 25,
    reward: { xp: 80, coins: 40 }
}

// Défi Social
{
    icon: '👥',
    title: 'Influenceur',
    description: 'Courir avec 10 personnes différentes',
    target: 10,
    reward: { xp: 120, coins: 60 }
}

// Défi de Distance
{
    icon: '🏃‍♂️',
    title: 'Ultra Runner',
    description: 'Parcourir 100 km en une semaine',
    target: 100,
    reward: { xp: 500, coins: 250 }
}

// Défi de Série
{
    icon: '🔥',
    title: 'Série Infernale',
    description: 'Courir 30 jours consécutifs',
    target: 30,
    reward: { xp: 1000, coins: 500 }
}
```

## 🏅 5. Ajouter des Badges Personnalisés

Ouvre `app.js`, trouve la fonction `getAllBadges()` (ligne ~650) :

```javascript
getAllBadges() {
    return [
        // Badges existants...
        
        // Ajoute ton badge ici
        {
            id: 'custom_badge1',              // ID unique
            name: 'Marathon Runner',          // Nom
            icon: '🏃‍♂️',                      // Emoji
            description: 'Cours 42 km',      // Description
            condition: () => APP_STATE.currentUser.totalDistance >= 42  // Condition
        }
    ];
}
```

### 🎖️ Exemples de Badges

```javascript
// Badge de Distance
{
    id: 'distance_500km',
    name: '500 km',
    icon: '🚀',
    description: 'Parcourir 500 km au total',
    condition: () => APP_STATE.currentUser.totalDistance >= 500
}

// Badge de Niveau
{
    id: 'level_50',
    name: 'Master',
    icon: '👑',
    description: 'Atteindre le niveau 50',
    condition: () => APP_STATE.currentUser.level >= 50
}

// Badge de Richesse
{
    id: 'rich_5000',
    name: 'Magnat',
    icon: '💎',
    description: 'Posséder 5000 coins',
    condition: () => APP_STATE.currentUser.coins >= 5000
}

// Badge de Temps
{
    id: 'time_100h',
    name: 'Centurion',
    icon: '⏰',
    description: 'Courir 100 heures au total',
    condition: () => APP_STATE.currentUser.totalTime >= 100
}

// Badge de Série
{
    id: 'streak_30',
    name: 'Mois Parfait',
    icon: '📅',
    description: 'Série de 30 jours',
    condition: () => APP_STATE.currentUser.currentStreak >= 30
}

// Badge Social
{
    id: 'friends_20',
    name: 'Populaire',
    icon: '🌟',
    description: 'Avoir 20 amis',
    condition: () => APP_STATE.currentUser.friends.length >= 20
}
```

## 🛒 6. Ajouter des Items à la Boutique

Ouvre `app.js`, trouve la fonction `getShopItems()` (ligne ~580) :

```javascript
function getShopItems() {
    return [
        // Items existants...
        
        // Ajoute ton item ici
        {
            id: 'custom_item1',
            name: 'Super Boost',
            icon: '⚡',
            price: 350,
            description: 'Triple XP pendant 1h'
        }
    ];
}
```

### 🎁 Exemples d'Items

```javascript
// Boost de Performance
{
    id: 'boost_triple',
    name: 'Mega Boost XP',
    icon: '🚀',
    price: 500,
    description: 'Triple XP pendant 2 heures'
}

// Cosmétiques
{
    id: 'avatar_ninja',
    name: 'Avatar Ninja',
    icon: '🥷',
    price: 200,
    description: 'Apparence unique sur la carte'
}

// Fonctionnalités
{
    id: 'stats_advanced',
    name: 'Stats Avancées',
    icon: '📊',
    price: 400,
    description: 'Débloque statistiques détaillées'
}

// Thèmes
{
    id: 'theme_sunset',
    name: 'Thème Coucher de Soleil',
    icon: '🌅',
    price: 300,
    description: 'Palette orange et rose'
}

// Effets Spéciaux
{
    id: 'trail_fire',
    name: 'Traînée de Feu',
    icon: '🔥',
    price: 450,
    description: 'Effet visuel sur tes déplacements'
}

// Outils
{
    id: 'tool_radar',
    name: 'Radar Étendu',
    icon: '📡',
    price: 600,
    description: 'Voir les coureurs jusqu\'à 100 km'
}
```

## 👤 7. Modifier les Données Utilisateur Initiales

Ouvre `app.js`, trouve la fonction `loadUserData()` (ligne ~800) :

```javascript
function loadUserData() {
    // ...
    // Données initiales pour la démo
    APP_STATE.currentUser.coins = 150;      // Coins de départ
    APP_STATE.currentUser.xp = 25;          // XP de départ
    APP_STATE.currentUser.totalRuns = 5;    // Courses initiales
    APP_STATE.currentUser.totalDistance = 23;  // Distance initiale (km)
    APP_STATE.currentUser.totalTime = 2;    // Temps initial (heures)
    APP_STATE.currentUser.currentStreak = 3;   // Série initiale
}
```

### 🎮 Profils de Départ Suggérés

#### Débutant
```javascript
coins: 100
xp: 0
totalRuns: 0
totalDistance: 0
totalTime: 0
currentStreak: 0
```

#### Intermédiaire (Défaut)
```javascript
coins: 150
xp: 25
totalRuns: 5
totalDistance: 23
totalTime: 2
currentStreak: 3
```

#### Expert
```javascript
coins: 1000
xp: 500
totalRuns: 50
totalDistance: 250
totalTime: 25
currentStreak: 10
```

#### Mode Dieu (Test)
```javascript
coins: 10000
xp: 5000
totalRuns: 500
totalDistance: 2000
totalTime: 200
currentStreak: 100
```

## 🗺️ 8. Personnaliser la Carte

### Changer le Style de la Carte

Ouvre `app.js`, trouve `initMap()` (ligne ~50) :

```javascript
// Carte par défaut (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(APP_STATE.map);
```

### 🗺️ Styles de Cartes Alternatifs (Gratuits)

#### CartoDB Dark Matter (Sombre)
```javascript
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap, © CARTO',
    maxZoom: 20
}).addTo(APP_STATE.map);
```

#### CartoDB Voyager (Coloré)
```javascript
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap, © CARTO',
    maxZoom: 20
}).addTo(APP_STATE.map);
```

#### Stamen Terrain (Relief)
```javascript
L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg', {
    attribution: 'Map tiles by Stamen Design, © OpenStreetMap',
    maxZoom: 18
}).addTo(APP_STATE.map);
```

#### Stamen Toner (Minimaliste)
```javascript
L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by Stamen Design, © OpenStreetMap',
    maxZoom: 20
}).addTo(APP_STATE.map);
```

## 📱 9. Modifier le Nom de l'Application

### Dans index.html
Ligne 6, change le titre :
```html
<title>PaceMate - Trouve ton partenaire de course 🏃‍♂️</title>
```

### Dans la navbar
Ligne 13-14 :
```html
<span class="logo-icon">🏃‍♂️</span>
<span class="logo-text">PaceMate</span>
```

## 🎵 10. Ajouter des Notifications Sonores (Bonus)

Ajoute cette fonction dans `app.js` :

```javascript
function playSound(type) {
    const sounds = {
        success: 'https://www.soundjay.com/button/sounds/button-09.mp3',
        levelUp: 'https://www.soundjay.com/button/sounds/button-10.mp3',
        coin: 'https://www.soundjay.com/button/sounds/button-16.mp3'
    };
    
    const audio = new Audio(sounds[type]);
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Son non disponible'));
}

// Utilise-le dans addXP, addCoins, etc.
function addXP(amount) {
    APP_STATE.currentUser.xp += amount;
    playSound('success');  // Ajoute cette ligne
    // ... reste du code
}
```

## 🔄 11. Réinitialiser les Données

Pour réinitialiser ta progression :

### Option 1 : Via Console
1. Ouvre la console (F12)
2. Tape : `localStorage.clear()`
3. Recharge la page (F5)

### Option 2 : Via Code
Ajoute un bouton dans `index.html` :
```html
<button onclick="resetProgress()">🔄 Réinitialiser</button>
```

Et dans `app.js` :
```javascript
function resetProgress() {
    if (confirm('Réinitialiser toute ta progression ?')) {
        localStorage.clear();
        location.reload();
    }
}
window.resetProgress = resetProgress;
```

## ⚠️ Conseils de Sécurité

1. **Sauvegarde avant modification** : Copie les fichiers originaux
2. **Teste après chaque changement** : Vérifie que tout fonctionne
3. **Utilise la console** : F12 pour voir les erreurs
4. **Lis les commentaires** : Le code est bien commenté
5. **Modifie petit à petit** : Ne change pas tout d'un coup

## 🎓 Ressources Utiles

- **Couleurs** : [Coolors.co](https://coolors.co/) - Générateur de palettes
- **Icônes** : [Emojipedia](https://emojipedia.org/) - Trouve des emojis
- **Carte** : [Leaflet Providers](https://leaflet-extras.github.io/leaflet-providers/preview/) - Styles de cartes
- **Coordonnées** : [LatLong.net](https://www.latlong.net/) - Trouve des coordonnées

## 🎉 Partage Ta Création !

Une fois personnalisée :
1. Héberge-la sur GitHub Pages
2. Partage le lien avec tes amis
3. Montre-nous tes modifications !

---

**Amuse-toi bien à personnaliser ton PaceMate ! 🎨🏃‍♂️**

