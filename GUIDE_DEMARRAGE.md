# 🚀 Guide de Démarrage Rapide - PaceMate

## 🎯 Lancer l'Application en 3 Étapes

### Méthode 1 : Double-clic (La plus simple !) 
1. **Double-clique** sur le fichier `index.html`
2. L'application s'ouvre dans ton navigateur par défaut
3. Autorise la géolocalisation si demandé (optionnel)
4. **C'est parti !** 🎉

### Méthode 2 : Avec un serveur local (Recommandé)

#### Option A : Python (Si installé)
```bash
# Ouvre un terminal dans le dossier paceMate
python -m http.server 8000
```
Puis ouvre : `http://localhost:8000`

#### Option B : Node.js (Si installé)
```bash
# Dans le dossier paceMate
npx http-server -p 8000
```
Puis ouvre : `http://localhost:8000`

#### Option C : VS Code Live Server
1. Installe l'extension "Live Server"
2. Clique droit sur `index.html`
3. Sélectionne "Open with Live Server"

## 🎮 Premier Pas dans l'Application

### 1️⃣ Géolocalisation (Recommandé)
- Au chargement, clique sur **"Autoriser"** pour la géolocalisation
- La carte se centre automatiquement sur ta position
- Des coureurs à proximité apparaissent autour de toi !

> 💡 **Pas de géolocalisation ?** Pas de problème ! L'app utilise Paris comme position par défaut.

### 2️⃣ Explorer la Carte 🗺️
- **Zoom/Dézoome** avec la molette ou les boutons +/-
- **Clique sur un coureur** 🏃‍♂️ pour voir son profil
- **Utilise les filtres** 🔍 pour affiner ta recherche
- **Bouton "Me localiser"** 📍 pour recentrer la carte

### 3️⃣ Défis du Jour 🎯
- Regarde la **sidebar gauche** : 3 défis quotidiens t'attendent !
- Clique sur **"Défis"** dans le menu pour voir tous les détails
- **Clique sur un défi** pour progresser (démo interactive)
- Gagne des **XP** et des **coins** ! 💰

### 4️⃣ Leaderboard 🏆
- Va sur **"Classement"**
- Change d'onglet : **Mondial** / **Local** / **Amis**
- Compare tes stats aux autres coureurs
- Objectif : **Top 3** pour le podium ! 🥇🥈🥉

### 5️⃣ Boutique 🛒
- Clique sur **"Boutique"**
- Achète des **items cool** avec tes coins
- **Avatars**, **badges**, **boosts XP**...
- Tes achats sont **sauvegardés** !

### 6️⃣ Profil 👤
- Va sur **"Profil"** pour voir tes statistiques
- **4 stats principales** : Courses, Distance, Temps, Série
- Collection de **badges** à débloquer
- Niveau et progression XP

## 🎁 Bonus de Démarrage

Tu commences avec :
- **150 coins** 💰
- **25 XP** ⭐
- **Niveau 1**
- **5 courses** complétées
- **23 km** parcourus
- **Série de 3 jours** 🔥

## 🎮 Interactions Clés

| Action | Résultat |
|--------|----------|
| **Cliquer sur un coureur** (carte) | Voir son profil détaillé |
| **Proposer une course** | Envoyer une demande + 10 XP |
| **Cliquer sur un défi** | Progresser dans le défi |
| **Acheter un item** | Dépenser des coins |
| **Envoyer un message** | Chat + 5 XP |
| **Ajouter un ami** | Système social |

## 🏃‍♂️ Simulateur de Course (Automatique)

L'application simule des courses en arrière-plan :
- **Toutes les 60 secondes** : Chance de gagner de l'XP aléatoire
- **Toutes les 30 secondes** : Les coureurs se déplacent légèrement
- Notifications automatiques 🔔

## 💾 Sauvegarde Automatique

Toutes tes données sont sauvegardées dans le navigateur :
- **XP, Niveau, Coins**
- **Défis complétés**
- **Badges débloqués**
- **Achats boutique**
- **Amis**

> ⚠️ **Attention** : Ne vide pas le cache du navigateur, sinon tu perds ta progression !

## 🎨 Interface

### Navigation Principale (Gauche)
- 🗺️ **Carte Interactive** - Vue par défaut
- 🎯 **Défis** - Quotidiens et hebdomadaires
- 🏆 **Classement** - Leaderboards
- 👥 **Amis** - Réseau social
- 🛒 **Boutique** - Achats
- 👤 **Profil** - Tes statistiques

### Barre du Haut
- 💰 **Coins** - Ta monnaie virtuelle
- ⭐ **Niveau** - Ta progression
- **Barre XP** - Jusqu'au prochain niveau

### Panneau de Droite
- 💬 **Chat** - Messages avec les coureurs
- (Masqué sur petits écrans)

## 🎯 Objectifs à Court Terme

### Débutant (Niveau 1-5)
1. ✅ Complète tes 3 défis quotidiens
2. ✅ Propose une course à 3 coureurs différents
3. ✅ Gagne 500 coins
4. ✅ Atteins le niveau 5

### Intermédiaire (Niveau 5-10)
1. ✅ Complète tous les défis hebdomadaires
2. ✅ Achète 3 items dans la boutique
3. ✅ Débloque 5 badges
4. ✅ Entre dans le top 10 local

### Avancé (Niveau 10+)
1. ✅ Atteins le niveau 20
2. ✅ Possède 1000 coins
3. ✅ Débloque tous les badges
4. ✅ Podium du leaderboard ! 🥇

## 🐛 Problèmes Courants

### La carte ne s'affiche pas
- ✅ Vérifie ta connexion internet (Leaflet et OpenStreetMap nécessitent internet)
- ✅ Ouvre la console développeur (F12) pour voir les erreurs
- ✅ Essaye de recharger la page (Ctrl+R)

### La géolocalisation ne fonctionne pas
- ✅ Vérifie les permissions du navigateur
- ✅ L'app fonctionne aussi sans géolocalisation (position par défaut : Paris)
- ✅ Certains navigateurs bloquent la géolocalisation sur `file://` (utilise un serveur local)

### Mes données ont disparu
- ✅ Ne vide pas le cache du navigateur
- ✅ Utilise toujours le même navigateur
- ✅ Les données sont par **site/navigateur**

### L'application est lente
- ✅ Ferme les autres onglets
- ✅ Utilise un navigateur récent (Chrome, Firefox, Edge)
- ✅ Vérifie ton processeur (l'app est client-side)

## 📱 Responsive Design

L'application s'adapte à tous les écrans :

### 💻 Desktop (>1200px)
- Layout 3 colonnes : Sidebar + Contenu + Chat
- Toutes les fonctionnalités visibles

### 📱 Tablette (768-1200px)
- Layout 2 colonnes : Sidebar + Contenu
- Chat masqué (fonctionnalité accessible via modal)

### 📱 Mobile (<768px)
- Layout 1 colonne verticale
- Navigation adaptée
- Sidebar rétractable

## 🎉 Astuces Pro

1. **Gagne des XP rapidement** : Complète les défis quotidiens chaque jour !
2. **Monte de niveau** : Chaque niveau = +50 coins bonus
3. **Économise tes coins** : Les meilleurs items coûtent cher
4. **Utilise les filtres** : Trouve le coureur parfait pour toi
5. **Sois social** : Interagir rapporte de l'XP
6. **Maintiens ta série** : Plus tu cours, plus tu gagnes de badges

## 🔥 Fonctionnalités Cachées

- **Clique plusieurs fois sur un défi** pour progresser plus vite (mode démo)
- **Montée de niveau automatique** quand tu atteins l'XP requis
- **Simulations automatiques** toutes les minutes (gains XP aléatoires)
- **Sauvegarde automatique** après chaque action

## 🎊 Prochaines Étapes

Une fois que tu maîtrises l'application :
1. 📖 Lis le `README.md` pour les détails techniques
2. 🔍 Explore le code dans `app.js`
3. 🎨 Personnalise les couleurs dans `styles.css`
4. 🚀 Ajoute tes propres fonctionnalités !

---

## 🆘 Besoin d'Aide ?

- 📖 Consulte le `README.md` pour la documentation complète
- 🔍 Ouvre la console (F12) pour voir les logs
- 💬 L'application affiche des notifications pour te guider

---

**Amuse-toi bien et bon running ! 🏃‍♂️💨**

*N'oublie pas : Le plus important, c'est de s'amuser !* 🎉

