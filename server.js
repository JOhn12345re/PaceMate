/**
 * PaceMate - Serveur Backend
 * Serveur Express avec Socket.IO pour les fonctionnalités multijoueurs en temps réel
 */

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Importation des routes
const authRoutes = require('./api/routes/auth');
const userRoutes = require('./api/routes/users');
const runRoutes = require('./api/routes/runs');
const challengeRoutes = require('./api/routes/challenges');
const leaderboardRoutes = require('./api/routes/leaderboard');
const gameRoutes = require('./api/routes/games');
const routeRoutes = require('./api/routes/routes');

// Configuration
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pacemate';

// Initialisation de l'application
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST']
    }
});

// Middleware de sécurité
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com', 'https://fonts.googleapis.com'],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com'],
            imgSrc: ["'self'", 'data:', 'https:', 'http:'],
            connectSrc: ["'self'", 'https:', 'http:', 'ws:', 'wss:']
        }
    }
}));

// Compression des réponses
app.use(compression());

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite de 100 requêtes par IP
});
app.use('/api/', limiter);

// Fichiers statiques
app.use(express.static('public', {
    maxAge: '1d',
    etag: true
}));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/runs', runRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/routes', routeRoutes);

// Route de santé
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Erreur serveur interne',
            status: err.status || 500
        }
    });
});

// Connexion à MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('✅ Connexion à MongoDB réussie');
    })
    .catch((err) => {
        console.error('❌ Erreur de connexion à MongoDB:', err);
        process.exit(1);
    });

// Socket.IO - Gestion des connexions en temps réel
const activeUsers = new Map();
const activeGames = new Map();

io.on('connection', (socket) => {
    console.log('🔌 Nouvel utilisateur connecté:', socket.id);

    // Authentification du socket
    socket.on('authenticate', async (token) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.userId;
            activeUsers.set(socket.userId, socket.id);

            socket.emit('authenticated', { userId: decoded.userId });

            // Notifier les amis de la connexion
            io.emit('user:online', { userId: decoded.userId });
        } catch (error) {
            socket.emit('auth:error', { message: 'Token invalide' });
        }
    });

    // Position en temps réel
    socket.on('location:update', (data) => {
        if (socket.userId) {
            // Diffuser la position aux joueurs proches
            socket.broadcast.emit('runner:moved', {
                userId: socket.userId,
                position: data.position,
                speed: data.speed
            });
        }
    });

    // Mini-jeux multijoueurs
    socket.on('game:join', (gameId) => {
        socket.join(`game:${gameId}`);
        const game = activeGames.get(gameId) || { players: [] };
        game.players.push(socket.userId);
        activeGames.set(gameId, game);

        io.to(`game:${gameId}`).emit('game:player-joined', {
            gameId,
            userId: socket.userId,
            playerCount: game.players.length
        });
    });

    socket.on('game:capture', (data) => {
        io.to(`game:${data.gameId}`).emit('zone:captured', {
            zoneId: data.zoneId,
            userId: socket.userId,
            team: data.team,
            timestamp: Date.now()
        });
    });

    socket.on('game:checkpoint', (data) => {
        io.to(`game:${data.gameId}`).emit('checkpoint:reached', {
            checkpointId: data.checkpointId,
            userId: socket.userId,
            time: data.time,
            timestamp: Date.now()
        });
    });

    socket.on('game:leave', (gameId) => {
        socket.leave(`game:${gameId}`);
        const game = activeGames.get(gameId);
        if (game) {
            game.players = game.players.filter(id => id !== socket.userId);
            if (game.players.length === 0) {
                activeGames.delete(gameId);
            } else {
                activeGames.set(gameId, game);
                io.to(`game:${gameId}`).emit('game:player-left', {
                    gameId,
                    userId: socket.userId,
                    playerCount: game.players.length
                });
            }
        }
    });

    // Chat en temps réel
    socket.on('chat:message', (data) => {
        if (socket.userId) {
            const recipientSocketId = activeUsers.get(data.recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('chat:message', {
                    from: socket.userId,
                    message: data.message,
                    timestamp: Date.now()
                });
            }
        }
    });

    socket.on('chat:typing', (data) => {
        if (socket.userId) {
            const recipientSocketId = activeUsers.get(data.recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('chat:typing', {
                    from: socket.userId
                });
            }
        }
    });

    // Défis en temps réel
    socket.on('challenge:invite', (data) => {
        const recipientSocketId = activeUsers.get(data.recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('challenge:invitation', {
                from: socket.userId,
                challengeType: data.challengeType,
                challengeId: data.challengeId
            });
        }
    });

    // Notifications
    socket.on('notification:send', (data) => {
        const recipientSocketId = activeUsers.get(data.recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('notification:received', {
                type: data.type,
                message: data.message,
                timestamp: Date.now()
            });
        }
    });

    // Déconnexion
    socket.on('disconnect', () => {
        console.log('🔌 Utilisateur déconnecté:', socket.id);

        if (socket.userId) {
            activeUsers.delete(socket.userId);
            io.emit('user:offline', { userId: socket.userId });

            // Retirer des jeux actifs
            activeGames.forEach((game, gameId) => {
                if (game.players.includes(socket.userId)) {
                    game.players = game.players.filter(id => id !== socket.userId);
                    if (game.players.length === 0) {
                        activeGames.delete(gameId);
                    } else {
                        activeGames.set(gameId, game);
                        io.to(`game:${gameId}`).emit('game:player-left', {
                            gameId,
                            userId: socket.userId,
                            playerCount: game.players.length
                        });
                    }
                }
            });
        }
    });
});

// Démarrage du serveur
server.listen(PORT, () => {
    console.log(`
    🚀 Serveur PaceMate démarré !
    📍 Port: ${PORT}
    🌐 URL: http://localhost:${PORT}
    🗄️  Base de données: ${MONGODB_URI}
    ⏰ Démarré à: ${new Date().toLocaleString()}
    `);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
    console.error('❌ Erreur non gérée:', err);
    server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM reçu. Arrêt gracieux...');
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log('✅ Connexions fermées. Serveur arrêté.');
            process.exit(0);
        });
    });
});

module.exports = { app, server, io };

