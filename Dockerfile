# Dockerfile pour PaceMate
FROM node:18-alpine

# Informations de métadonnées
LABEL maintainer="PaceMate Team"
LABEL description="Application de running sociale avec fonctionnalités multijoueurs"

# Créer le répertoire de l'application
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances de production
RUN npm ci --only=production && npm cache clean --force

# Copier le code source
COPY . .

# Créer le dossier public et copier les fichiers statiques
RUN mkdir -p public && \
    cp index.html public/ && \
    cp styles.css public/ && \
    cp app.js public/

# Exposer le port
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3000

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Changer le propriétaire des fichiers
RUN chown -R nodejs:nodejs /usr/src/app

# Utiliser l'utilisateur non-root
USER nodejs

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Démarrer l'application
CMD ["node", "server.js"]

