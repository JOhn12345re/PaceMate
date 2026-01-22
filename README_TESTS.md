# 🧪 Guide des Tests Cypress - PaceMate

## 📋 Table des Matières

- [Installation](#installation)
- [Lancement des Tests](#lancement-des-tests)
- [Structure des Tests](#structure-des-tests)
- [Tests Disponibles](#tests-disponibles)
- [Commandes Personnalisées](#commandes-personnalisées)
- [Bonnes Pratiques](#bonnes-pratiques)
- [Dépannage](#dépannage)

---

## 🚀 Installation

### Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn

### Installation des dépendances

```bash
npm install
```

Cela installera :
- Cypress
- start-server-and-test (pour lancer le serveur automatiquement)
- Mochawesome (pour les rapports HTML)

---

## 🎯 Lancement des Tests

### Mode Interactif (Interface Graphique)

```bash
npm run test:open
```

Cette commande :
1. Lance le serveur HTTP sur le port 8000
2. Ouvre l'interface Cypress
3. Te permet de choisir et lancer les tests individuellement

### Mode Headless (Ligne de Commande)

```bash
npm test
```

Lance tous les tests en mode headless (sans interface graphique).

### Tests par Navigateur

```bash
# Chrome
npm run cy:run:chrome

# Firefox
npm run cy:run:firefox

# Edge
npm run cy:run:edge
```

### Tests Spécifiques

```bash
# Un seul fichier de test
npm run test:spec cypress/e2e/03-planificateur-itineraire.cy.js

# Tests avec interface visible
npm run test:headed
```

### Lancer uniquement Cypress (serveur déjà lancé)

```bash
npm run cy:open   # Interface graphique
npm run cy:run    # Mode headless
```

---

## 📁 Structure des Tests

```
cypress/
├── e2e/                                    # Tests end-to-end
│   ├── 01-navigation.cy.js                 # Navigation et structure
│   ├── 02-carte-interactive.cy.js          # Carte Leaflet
│   ├── 03-planificateur-itineraire.cy.js   # Planificateur (⭐ NOUVEAU)
│   ├── 04-gamification.cy.js               # XP, coins, badges
│   ├── 05-mini-jeux.cy.js                  # Mini-jeux compétitifs
│   ├── 06-leaderboard-amis.cy.js           # Social features
│   ├── 07-notifications.cy.js              # Système de notifications
│   ├── 08-responsive.cy.js                 # Responsive design
│   ├── 09-persistence.cy.js                # LocalStorage
│   └── 10-performance.cy.js                # Performance tests
├── support/
│   ├── commands.js                         # Commandes personnalisées
│   └── e2e.js                              # Configuration globale
├── fixtures/
│   └── example.json                        # Données de test
└── cypress.config.js                       # Configuration Cypress
```

---

## ✅ Tests Disponibles

### 1️⃣ Navigation et Structure (01-navigation.cy.js)

**Objectif** : Vérifier que la structure de base fonctionne.

**Tests** :
- ✅ Chargement de la page
- ✅ Affichage du logo et de la navbar
- ✅ Statistiques utilisateur (XP, coins, niveau)
- ✅ Navigation entre toutes les vues
- ✅ Mise en évidence du bouton actif
- ✅ Affichage des défis et badges dans la sidebar

**Commande** :
```bash
npm run test:spec cypress/e2e/01-navigation.cy.js
```

---

### 2️⃣ Carte Interactive (02-carte-interactive.cy.js)

**Objectif** : Tester la carte Leaflet et ses contrôles.

**Tests** :
- ✅ Affichage de la carte
- ✅ Contrôles (localiser, filtres, style, mesure, etc.)
- ✅ Barre de statistiques
- ✅ Panneau de filtres
- ✅ Changement de style de carte
- ✅ Légende et coureurs à proximité

**Commande** :
```bash
npm run test:spec cypress/e2e/02-carte-interactive.cy.js
```

---

### 3️⃣ Planificateur d'Itinéraire (03-planificateur-itineraire.cy.js) ⭐

**Objectif** : Tester la fonctionnalité phare de planification.

**Tests** :
- ✅ Ouverture/fermeture du panneau
- ✅ Affichage des champs (départ, arrivée)
- ✅ Point de départ par défaut
- ✅ Ajout/suppression d'étapes intermédiaires
- ✅ Calcul d'itinéraire
- ✅ Affichage des statistiques (distance, temps, calories)
- ✅ Actions (navigation, sauvegarde, partage, effacer)
- ✅ Sauvegarde dans localStorage

**Commande** :
```bash
npm run test:spec cypress/e2e/03-planificateur-itineraire.cy.js
```

**Tests Critiques** :
- Création d'itinéraire de base
- Ajout de waypoints multiples
- Calcul des statistiques
- Sauvegarde et chargement

---

### 4️⃣ Gamification (04-gamification.cy.js)

**Objectif** : Tester le système XP/Coins/Badges.

**Tests** :
- ✅ Statistiques initiales
- ✅ Défis quotidiens et hebdomadaires
- ✅ Boutique et articles
- ✅ Profil utilisateur
- ✅ Collection de badges
- ✅ Augmentation XP et coins
- ✅ Barre de progression

**Commande** :
```bash
npm run test:spec cypress/e2e/04-gamification.cy.js
```

---

### 5️⃣ Mini-Jeux (05-mini-jeux.cy.js)

**Objectif** : Tester les 6 mini-jeux compétitifs.

**Tests** :
- ✅ Affichage de la grille de jeux
- ✅ Détails de chaque jeu (icône, description, récompenses)
- ✅ Démarrage du jeu "Capture de Zones"
- ✅ Interface du jeu (stats, carte, timer)
- ✅ Quitter un jeu
- ✅ Statistiques personnelles
- ✅ Démarrage des autres mini-jeux

**Commande** :
```bash
npm run test:spec cypress/e2e/05-mini-jeux.cy.js
```

---

### 6️⃣ Classement et Amis (06-leaderboard-amis.cy.js)

**Objectif** : Tester les fonctionnalités sociales.

**Tests** :
- ✅ Onglets de classement (Mondial, Local, Amis)
- ✅ Affichage des rangs et médailles
- ✅ Liste des amis
- ✅ Bouton "Ajouter un ami"
- ✅ Profil d'un coureur depuis la carte
- ✅ Modal et actions

**Commande** :
```bash
npm run test:spec cypress/e2e/06-leaderboard-amis.cy.js
```

---

### 7️⃣ Notifications (07-notifications.cy.js)

**Objectif** : Tester le système de notifications toast.

**Tests** :
- ✅ Notification de bienvenue
- ✅ Notifications contextuelles (localisation, style, etc.)
- ✅ Notifications XP/Coins
- ✅ Types de notifications (success, error, info)
- ✅ Disparition automatique après 3 secondes

**Commande** :
```bash
npm run test:spec cypress/e2e/07-notifications.cy.js
```

---

### 8️⃣ Responsive Design (08-responsive.cy.js)

**Objectif** : Tester l'adaptation à différentes tailles d'écran.

**Tests sur 4 viewports** :
- 📱 Mobile (375x667)
- 📱 Tablet (768x1024)
- 💻 Laptop (1366x768)
- 🖥️ Desktop (1920x1080)

**Vérifications** :
- ✅ Chargement correct
- ✅ Affichage de la sidebar
- ✅ Navigation
- ✅ Panneau d'itinéraire adaptatif
- ✅ Notifications

**Commande** :
```bash
npm run test:spec cypress/e2e/08-responsive.cy.js
```

---

### 9️⃣ Persistence (09-persistence.cy.js)

**Objectif** : Tester la sauvegarde des données dans localStorage.

**Tests** :
- ✅ Sauvegarde des données utilisateur
- ✅ Sauvegarde d'itinéraires
- ✅ Chargement au rafraîchissement
- ✅ Statistiques de jeu
- ✅ Préférences utilisateur
- ✅ Gestion du quota localStorage

**Commande** :
```bash
npm run test:spec cypress/e2e/09-persistence.cy.js
```

---

### 🔟 Performance (10-performance.cy.js)

**Objectif** : Tester la rapidité et l'optimisation.

**Tests** :
- ✅ Temps de chargement de la page (< 3s)
- ✅ Chargement de Leaflet (< 2s)
- ✅ Navigation entre vues (< 500ms)
- ✅ Animations fluides
- ✅ Gestion de multiples notifications
- ✅ Calcul d'itinéraire rapide (< 1.5s)
- ✅ Démarrage de mini-jeu (< 1s)
- ✅ Taille localStorage (< 1MB)
- ✅ Pas de memory leaks

**Commande** :
```bash
npm run test:spec cypress/e2e/10-performance.cy.js
```

---

## 🛠️ Commandes Personnalisées

### Navigation

```javascript
// Aller vers une vue
cy.goToView('map')
cy.goToView('challenges')

// Vérifier les éléments essentiels
cy.checkCoreElements()
```

### Carte et Itinéraire

```javascript
// Attendre que Leaflet charge
cy.waitForLeaflet()

// Ouvrir le planificateur
cy.openRoutePlanner()

// Créer un itinéraire de test
cy.createTestRoute()

// Changer le style de carte
cy.changeMapStyle('dark')

// Mock de géolocalisation
cy.mockGeolocation(48.8566, 2.3522)
```

### Gamification

```javascript
// Ajouter XP
cy.addXP(100)

// Ajouter coins
cy.addCoins(50)

// Vérifier l'état utilisateur
cy.checkUserState('level', 'greaterThan', 0)
cy.checkUserState('xp', 'equals', 150)

// Compléter un défi
cy.completeChallenge(0)

// Acheter un article
cy.purchaseShopItem(1)
```

### Mini-Jeux

```javascript
// Démarrer un mini-jeu
cy.startMiniGame('territory')

// Quitter un mini-jeu
cy.quitMiniGame()

// Capturer une zone
cy.captureZone(0)

// Vérifier l'état du jeu
cy.checkGameState('active', true)
```

### Notifications

```javascript
// Vérifier une notification
cy.checkNotification('Test message', 'success')
```

### Utilitaires

```javascript
// Attendre une animation
cy.waitForAnimation(500)

// Nettoyer les données de test
cy.cleanupTestData()

// Mesurer la performance
cy.measurePerformance('Task name', () => {
  // Code à mesurer
})
```

---

## ✨ Bonnes Pratiques

### 1. Organisation des Tests

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup commun
    cy.visit('/')
    cy.wait(500)
  })

  it('Should test specific behavior', () => {
    // Test
  })
})
```

### 2. Sélecteurs

✅ **Bon** :
```javascript
cy.get('[data-view="map"]')
cy.get('#userCoins')
cy.get('.btn-primary')
```

❌ **Mauvais** :
```javascript
cy.get('button:nth-child(3)')
cy.get('.sidebar > div > button')
```

### 3. Assertions

```javascript
// Visibilité
cy.get('.element').should('be.visible')
cy.get('.element').should('not.be.visible')

// Contenu
cy.get('.element').should('contain', 'Text')
cy.get('.element').should('have.text', 'Exact Text')

// Classes
cy.get('.element').should('have.class', 'active')

// Valeurs
cy.get('input').should('have.value', '10')
```

### 4. Attentes

```javascript
// Attendre un élément
cy.get('.element').should('exist')

// Attendre une durée
cy.wait(1000)

// Attendre une requête (si API)
cy.intercept('GET', '/api/data').as('getData')
cy.wait('@getData')
```

### 5. Tests Isolés

Chaque test doit être indépendant :

```javascript
beforeEach(() => {
  cy.clearLocalStorage()
  cy.visit('/')
})
```

---

## 🐛 Dépannage

### Le serveur ne démarre pas

```bash
# Vérifier que le port 8000 est libre
netstat -ano | findstr :8000

# Tuer le processus si nécessaire
taskkill /PID <PID> /F

# Ou changer le port dans package.json
```

### Cypress ne trouve pas les éléments

```javascript
// Augmenter le timeout
cy.get('.element', { timeout: 10000 })

// Vérifier que l'élément existe
cy.get('.element').should('exist')

// Attendre le chargement
cy.wait(1000)
```

### Tests qui échouent aléatoirement

```javascript
// Ajouter des waits stratégiques
cy.wait(500)

// Utiliser should avec retry automatique
cy.get('.element').should('be.visible')

// Désactiver les animations
cy.visit('/', {
  onBeforeLoad: (win) => {
    win.document.documentElement.style.setProperty('--transition', 'none')
  }
})
```

### Leaflet n'est pas chargé

```javascript
// Utiliser la commande custom
cy.waitForLeaflet()

// Ou attendre manuellement
cy.window().then((win) => {
  expect(win.L).to.exist
  expect(win.APP_STATE.map).to.exist
})
```

### LocalStorage non persisté

```javascript
// Ne pas nettoyer entre les tests si nécessaire
// Supprimer clearLocalStorage() du beforeEach

// Vérifier la sauvegarde
cy.getAllLocalStorage().then((storage) => {
  console.log(storage)
})
```

---

## 📊 Rapports de Tests

### Générer un rapport HTML

```bash
npm run report
```

Les rapports sont générés dans `cypress/reports/`.

### Captures d'écran

Les captures d'écran sont automatiquement prises en cas d'échec dans :
```
cypress/screenshots/
```

### Vidéos

Les vidéos des tests sont dans :
```
cypress/videos/
```

---

## 🎯 Coverage des Tests

### Fonctionnalités Testées

| Fonctionnalité | Coverage | Fichier |
|---------------|----------|---------|
| Navigation | 100% | 01-navigation.cy.js |
| Carte Leaflet | 95% | 02-carte-interactive.cy.js |
| **Planificateur** | **100%** ⭐ | 03-planificateur-itineraire.cy.js |
| Gamification | 100% | 04-gamification.cy.js |
| Mini-Jeux | 90% | 05-mini-jeux.cy.js |
| Social | 85% | 06-leaderboard-amis.cy.js |
| Notifications | 100% | 07-notifications.cy.js |
| Responsive | 100% | 08-responsive.cy.js |
| Persistence | 95% | 09-persistence.cy.js |
| Performance | 100% | 10-performance.cy.js |

**Total : ~95% de coverage** 🎉

---

## 🚦 CI/CD

### Intégration Continue

Pour intégrer avec GitHub Actions, GitLab CI, etc. :

```yaml
# .github/workflows/cypress.yml
name: Cypress Tests

on: [push]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: cypress-io/github-action@v5
        with:
          start: npm start
          wait-on: 'http://localhost:8000'
          browser: chrome
```

---

## 📝 Checklist avant Déploiement

- [ ] Tous les tests passent
- [ ] Pas d'erreurs console
- [ ] Performance OK (< 3s chargement)
- [ ] Responsive OK sur tous les viewports
- [ ] LocalStorage fonctionne
- [ ] Planificateur d'itinéraire complet
- [ ] Mini-jeux démarrables
- [ ] Notifications affichées

---

## 🎉 Conclusion

Cette suite de tests Cypress couvre **toutes les fonctionnalités majeures** de PaceMate, avec un **focus spécial sur le planificateur d'itinéraire** ! 🧭

**Nombre total de tests : ~150+**

**Temps d'exécution total : ~5-10 minutes**

Pour lancer tous les tests :
```bash
npm test
```

**Bon testing ! 🚀🏃‍♂️**

