# 🏃‍♂️ PaceMate - Trouve ton partenaire de course

**PaceMate** est une application web révolutionnaire qui rend le running **FUN, SOCIAL et ADDICTIF** ! 

## ✨ Fonctionnalités principales

### 🗺️ Carte Interactive
- **Géolocalisation en temps réel** avec Leaflet.js
- Visualise les **coureurs à proximité** sur une carte interactive
- **Filtres intelligents** : distance, allure, niveau
- Système de **matching automatique** par vitesse et niveau
- Points de rencontre et itinéraires suggérés

### 🎮 Gamification Poussée
- **Système d'XP et de niveaux** progressifs
- **Coins virtuels** à gagner et dépenser
- Défis quotidiens et hebdomadaires variés
- Récompenses et bonus de niveau
- Progression motivante avec barres XP animées

### 🎯 Défis & Missions
- **Défis quotidiens** : objectifs courts et accessibles
- **Défis hebdomadaires** : challenges ambitieux
- Récompenses en XP et coins
- Suivi de progression en temps réel
- Validation instantanée

### 🏆 Classements & Compétition
- **Leaderboard mondial** : compétition globale
- **Classement local** : coureurs de ta région
- **Classement amis** : défie tes proches
- Statistiques détaillées par joueur
- Podiums animés (Or, Argent, Bronze)

### 👥 Social & Communauté
- Système d'**amis** avec statut en ligne
- **Chat intégré** pour communiquer
- Demandes de course personnalisées
- Profils détaillés avec statistiques
- Feed d'activité communautaire

### 🛒 Boutique Virtuelle
- **Avatars premium** et personnalisations
- **Badges exclusifs** à débloquer
- **Boosts XP** temporaires
- Thèmes visuels
- Effets spéciaux sur la carte

### 🏅 Système de Badges
- **8 badges** à débloquer
- Conditions variées (niveau, distance, social...)
- Collection visible sur le profil
- Badges rares et prestigieux
- Notification de déblocage

### 📊 Profil Personnel
- **Statistiques complètes** : courses, distance, temps
- Séries de jours consécutifs
- Collection de badges
- Historique de progression
- Niveau et XP détaillés

## 🚀 Installation et Utilisation

### Prérequis
Aucun ! Il suffit d'un navigateur web moderne.

### Lancement
1. Ouvre le fichier `index.html` dans ton navigateur
2. Autorise la géolocalisation (optionnel mais recommandé)
3. Commence à explorer l'application !

### Ou utilise un serveur local
```bash
# Python 3
python -m http.server 8000

# Node.js avec npx
npx http-server -p 8000
```

Puis ouvre `http://localhost:8000` dans ton navigateur.

## 🎨 Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Design moderne et responsive
  - Variables CSS
  - Flexbox & Grid
  - Animations et transitions
  - Gradients dynamiques
- **JavaScript (Vanilla)** : Logique applicative
  - ES6+ features
  - LocalStorage pour la sauvegarde
  - API Geolocation
- **Leaflet.js** : Cartes interactives
- **OpenStreetMap** : Données cartographiques gratuites
- **Google Fonts (Poppins)** : Typographie moderne

## 🎯 Architecture du Code

```
paceMate/
├── index.html          # Structure HTML principale
├── styles.css          # Styles et animations
├── app.js             # Logique JavaScript complète
├── README.md          # Documentation
└── prompt.txt         # Cahier des charges original
```

### Structure du Code JavaScript

```javascript
// Configuration globale
CONFIG = { map, xp, ... }

// État de l'application
APP_STATE = { currentUser, nearbyRunners, challenges, ... }

// Modules principaux
- Gestion de la carte (Leaflet)
- Système de gamification (XP, niveaux, coins)
- Défis quotidiens/hebdomadaires
- Leaderboards (mondial, local, amis)
- Système d'amis
- Boutique virtuelle
- Badges et récompenses
- Chat et notifications
- Sauvegarde LocalStorage
```

## 💡 Fonctionnalités Détaillées

### Système d'XP
- XP de base : 100 pour le niveau 1
- Multiplicateur : 1.5x par niveau
- Montée de niveau automatique
- Bonus de 50 coins par niveau

### Défis
**Quotidiens** (3 défis/jour)
- Coureur du matin : 5 km avant midi (+50 XP, +20 coins)
- Maintiens la série : 30 min de course (+40 XP, +15 coins)
- Vitesse éclair : 1 km < 5 min/km (+60 XP, +25 coins)

**Hebdomadaires** (3 défis/semaine)
- Marathon personnel : 50 km (+200 XP, +100 coins)
- Social runner : 5 courses avec différentes personnes (+150 XP, +75 coins)
- Champion du leaderboard : Top 10 local (+250 XP, +150 coins)

### Badges
1. **Première Course** 🏃‍♂️ : Complète 1 course
2. **Niveau 5** ⭐ : Atteins le niveau 5
3. **Niveau 10** 🌟 : Atteins le niveau 10
4. **Série de 7** 🔥 : 7 jours consécutifs
5. **Millionnaire** 💰 : Possède 1000 coins
6. **100 km** 📏 : Cours 100 km au total
7. **Social** 👥 : Ajoute 5 amis
8. **Shopper** 🛒 : Achète 5 articles

### Boutique
- **Avatar Premium** 👑 : 100 coins
- **Badge Éclair** ⚡ : 150 coins
- **Boost XP x2** 🚀 : 200 coins
- **Thème Nuit** 🌙 : 250 coins
- **Traînée Arc-en-ciel** 🌈 : 300 coins
- **Titre "Champion"** 🏆 : 500 coins

## 🎮 Guide d'Utilisation

### Navigation
- **Carte Interactive** : Trouve des coureurs près de toi
- **Défis** : Consulte et complète les défis
- **Classement** : Compare-toi aux autres coureurs
- **Amis** : Gère ta liste d'amis
- **Boutique** : Achète des items avec tes coins
- **Profil** : Consulte tes statistiques

### Interactions
- **Clic sur la carte** : Voir les détails d'un coureur
- **Clic sur un défi** : Progresser dans le défi
- **Clic sur un item** : Acheter dans la boutique
- **Filtres** : Affiner la recherche de coureurs

## 📱 Responsive Design

L'application s'adapte à tous les écrans :
- **Desktop** (>1200px) : Layout complet avec 3 colonnes
- **Tablette** (768-1200px) : 2 colonnes, chat masqué
- **Mobile** (<768px) : Layout vertical, navigation simplifiée

## 🔒 Données & Confidentialité

- **Sauvegarde locale** : Toutes les données sont stockées dans le navigateur (LocalStorage)
- **Aucun serveur** : Application 100% client-side
- **Données simulées** : Les coureurs affichés sont générés aléatoirement pour la démo
- **Géolocalisation** : Utilisée uniquement localement, jamais partagée

## 🚧 Évolutions Futures

### Version 2.0 (Backend)
- [ ] Authentification utilisateur
- [ ] Base de données réelle
- [ ] Vrais coureurs en temps réel
- [ ] Système de messagerie persistant
- [ ] Historique de courses détaillé
- [ ] Intégrations (Strava, Garmin...)

### Fonctionnalités Additionnelles
- [ ] Groupes et clubs de running
- [ ] Événements et courses organisées
- [ ] Itinéraires partagés et favoris
- [ ] Coach virtuel avec conseils personnalisés
- [ ] Météo intégrée
- [ ] Musique synchronisée au rythme
- [ ] Défis de groupe
- [ ] Saisons et événements spéciaux

## 🎨 Palette de Couleurs

```css
--primary: #FF6B35        /* Orange énergique */
--secondary: #4ECDC4      /* Turquoise frais */
--accent: #FFE66D         /* Jaune vif */
--success: #06D6A0        /* Vert succès */
--danger: #EF476F         /* Rouge alerte */
--dark: #1A1A2E          /* Bleu nuit */
```

## 🤝 Contribution

Ce projet est une démo. Pour contribuer :
1. Fork le projet
2. Crée une branche (`git checkout -b feature/AmazingFeature`)
3. Commit tes changements (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvre une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Utilise-le librement !

## 🎉 Crédits

- **Cartes** : [Leaflet.js](https://leafletjs.com/) + [OpenStreetMap](https://www.openstreetmap.org/)
- **Fonts** : [Google Fonts - Poppins](https://fonts.google.com/specimen/Poppins)
- **Icônes** : Emojis natifs du navigateur
- **Concept** : Rendre le running addictif et social ! 🏃‍♂️💨

---

**Développé avec ❤️ et beaucoup de ☕ pour les passionnés de running !**

🏃‍♂️ **Cours, Connecte, Conquiers !** 💪

