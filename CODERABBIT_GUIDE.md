# 🐰 Guide CodeRabbit - PaceMate

## 📋 Qu'est-ce que CodeRabbit ?

CodeRabbit est un assistant IA qui analyse automatiquement votre code lors des Pull Requests pour :
- 🔍 Détecter les bugs et vulnérabilités
- 📊 Suggérer des améliorations de performance
- 🎨 Vérifier les bonnes pratiques
- 📖 Améliorer la documentation
- 🔒 Identifier les failles de sécurité

## ⚙️ Configuration

### Fichiers de configuration créés

1. **`.coderabbit.yml`** - Configuration principale
   - Langue des reviews : Français
   - Règles d'analyse personnalisées
   - Instructions spécifiques par type de fichier

2. **`.eslintrc.json`** - Linter JavaScript
   - Règles de style de code
   - Détection d'erreurs communes
   - Standards ES2021

3. **`.github/workflows/coderabbit.yml`** - CI/CD
   - Analyse automatique sur chaque PR
   - Exécution d'ESLint
   - Upload des rapports

4. **Templates GitHub**
   - Template de Pull Request
   - Template de Bug Report
   - Template de Feature Request

## 🚀 Activation

### 1. Sur GitHub

1. Allez sur [coderabbit.ai](https://coderabbit.ai)
2. Connectez-vous avec GitHub
3. Autorisez CodeRabbit sur votre dépôt PaceMate
4. C'est tout ! 🎉

### 2. Installation locale d'ESLint

```bash
# Installer ESLint et le plugin Cypress
npm install --save-dev eslint eslint-plugin-cypress

# Lancer ESLint
npx eslint .

# Corriger automatiquement ce qui peut l'être
npx eslint . --fix
```

## 📊 Utilisation

### Sur les Pull Requests

1. **Créez une branche**
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```

2. **Faites vos modifications**
   ```bash
   git add .
   git commit -m "feat: ajouter nouvelle fonctionnalité"
   ```

3. **Pushez et créez une PR**
   ```bash
   git push origin feature/ma-nouvelle-fonctionnalite
   ```

4. **CodeRabbit analyse automatiquement** 🐰
   - Reviews automatiques en français
   - Suggestions de code
   - Détection de bugs
   - Vérification de sécurité

### Commandes CodeRabbit

Dans les commentaires de PR, vous pouvez utiliser :

```
@coderabbitai help
```
Affiche l'aide

```
@coderabbitai review
```
Force une nouvelle review

```
@coderabbitai resolve
```
Marque un commentaire comme résolu

```
@coderabbitai pause
```
Met en pause les reviews

```
@coderabbitai resume
```
Reprend les reviews

## 🎯 Points d'attention de CodeRabbit

### Sécurité 🔒

- **Variables sensibles** : Pas de secrets dans le code
- **Injections** : SQL/NoSQL, XSS
- **Authentification** : Vérification JWT
- **Validation** : Inputs utilisateur
- **CORS** : Configuration correcte

### Performance ⚡

- **Boucles** : Optimisation
- **Requêtes DB** : Index, pagination
- **Fuites mémoire** : Event listeners
- **Cache** : Utilisation appropriée
- **Bundle size** : Minification

### Code Quality 📝

- **Nommage** : Variables explicites
- **Fonctions** : Petites et focalisées
- **Duplication** : Code réutilisable
- **Commentaires** : Code documenté
- **Tests** : Couverture suffisante

### Architecture 🏗️

- **Séparation** : Logique/présentation
- **Modularité** : Code modulaire
- **Dépendances** : Gestion propre
- **Patterns** : Bonnes pratiques
- **Scalabilité** : Code évolutif

## 🛠️ Configuration personnalisée

### Modifier les règles d'analyse

Éditez `.coderabbit.yml` :

```yaml
reviews:
  path_instructions:
    - path: "mon-fichier.js"
      instructions: |
        - Vérifier X
        - Valider Y
        - Confirmer Z
```

### Ignorer des fichiers

Dans `.coderabbit.yml` :

```yaml
reviews:
  path_filters:
    - "!**/test/**"
    - "!**/node_modules/**"
```

## 📈 Rapports

### ESLint Report

Généré automatiquement dans la CI :

```bash
# Local
npx eslint . --format html --output-file eslint-report.html
```

### CodeRabbit Dashboard

Accédez à [coderabbit.ai/dashboard](https://coderabbit.ai/dashboard) pour :
- Statistiques d'analyse
- Historique des reviews
- Métriques de qualité
- Tendances

## 🔧 Intégration IDE

### VS Code

1. Installez l'extension ESLint
2. CodeRabbit apparaîtra dans les PRs GitHub
3. Les erreurs ESLint s'affichent en temps réel

### Configuration VS Code

Ajoutez dans `.vscode/settings.json` :

```json
{
  "eslint.enable": true,
  "eslint.validate": [
    "javascript"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 📋 Checklist avant PR

Avant de créer une Pull Request :

### Code
- [ ] ESLint ne remonte aucune erreur
- [ ] Pas de console.log() oublié
- [ ] Code commenté si complexe
- [ ] Noms de variables explicites

### Tests
- [ ] Tests ajoutés/mis à jour
- [ ] Tous les tests passent
- [ ] Testé manuellement

### Sécurité
- [ ] Pas de secrets dans le code
- [ ] Inputs validés
- [ ] Authentification vérifiée

### Documentation
- [ ] README mis à jour
- [ ] CHANGELOG mis à jour
- [ ] Commentaires JSDoc

### Performance
- [ ] Pas de boucles infinies
- [ ] Requêtes DB optimisées
- [ ] Pas de fuites mémoire

## 🎓 Ressources

### Documentation
- [CodeRabbit Docs](https://docs.coderabbit.ai)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [JavaScript Best Practices](https://github.com/ryanmcdermott/clean-code-javascript)

### Commandes utiles

```bash
# Analyser tout le code
npx eslint .

# Analyser un fichier
npx eslint server.js

# Corriger automatiquement
npx eslint . --fix

# Format JSON (pour CI)
npx eslint . --format json --output-file report.json

# Format HTML (lisible)
npx eslint . --format html --output-file report.html
```

## 💡 Bonnes pratiques

### Commits

Utilisez des messages de commit conventionnels :

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactoring
test: ajout de tests
chore: maintenance
```

### Pull Requests

- **Petites PRs** : Plus facile à review
- **Description claire** : Contexte et objectif
- **Screenshots** : Si changement UI
- **Tests** : Couvrir les nouveaux cas
- **Checklist** : Utiliser le template

### Réponses aux reviews

- **Respectueux** : CodeRabbit veut aider
- **Justifier** : Expliquer vos choix
- **Apprendre** : Améliorer continuellement
- **Itérer** : Améliorer progressivement

## 🐛 Dépannage

### CodeRabbit ne commente pas

1. Vérifiez que le repo est bien configuré
2. Vérifiez les permissions GitHub
3. Regardez les logs de la CI

### ESLint erreurs

```bash
# Réinstaller les dépendances
npm install

# Vérifier la config
npx eslint --print-config server.js

# Debug
npx eslint . --debug
```

### Trop de warnings

Ajustez les règles dans `.eslintrc.json` :

```json
{
  "rules": {
    "no-console": "off"
  }
}
```

## 🎉 Avantages

### Pour le développeur
- 🤖 Reviews instantanées
- 📚 Apprentissage continu
- ⚡ Détection précoce des bugs
- 🎯 Focus sur la logique métier

### Pour l'équipe
- 🔄 Standards de code unifiés
- 📊 Qualité mesurable
- 🚀 Déploiements plus sûrs
- 💬 Reviews plus focalisées

### Pour le projet
- 🐛 Moins de bugs en production
- 🔒 Meilleure sécurité
- ⚡ Meilleures performances
- 📈 Maintenabilité accrue

---

**Note** : CodeRabbit est un outil d'aide, pas un remplacement des code reviews humaines. Utilisez-le comme un premier filtre pour permettre aux reviewers humains de se concentrer sur la logique métier et l'architecture ! 🚀

