/**
 * Routes de mini-jeux
 */

const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// Créer un nouveau jeu
router.post('/', async (req, res) => {
    try {
        const gameData = {
            ...req.body,
            creator: req.user.userId,
            players: [{
                userId: req.user.userId,
                team: req.body.mode === 'team' ? 'red' : 'none',
                score: 0
            }],
            status: 'waiting'
        };

        const game = new Game(gameData);
        await game.save();

        res.status(201).json({
            message: 'Jeu créé',
            game
        });

    } catch (error) {
        console.error('Erreur création jeu:', error);
        res.status(500).json({ error: 'Erreur lors de la création du jeu' });
    }
});

// Obtenir les jeux disponibles
router.get('/available', async (req, res) => {
    try {
        const { gameType, latitude, longitude, radius = 5000 } = req.query;

        const query = {
            status: { $in: ['waiting', 'active'] }
        };

        if (gameType) {
            query.gameType = gameType;
        }

        if (latitude && longitude) {
            query['settings.area.center'] = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(radius)
                }
            };
        }

        const games = await Game.find(query)
            .populate('creator', 'username profile.avatar profile.level')
            .populate('players.userId', 'username profile.avatar')
            .sort('-createdAt')
            .limit(20);

        res.json({ games });

    } catch (error) {
        console.error('Erreur jeux disponibles:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des jeux' });
    }
});

// Rejoindre un jeu
router.post('/:gameId/join', async (req, res) => {
    try {
        const { team } = req.body;
        const game = await Game.findById(req.params.gameId);

        if (!game) {
            return res.status(404).json({ error: 'Jeu non trouvé' });
        }

        if (game.status !== 'waiting') {
            return res.status(400).json({ error: 'Ce jeu a déjà commencé' });
        }

        // Vérifier si déjà dans le jeu
        const alreadyJoined = game.players.some(
            p => p.userId.toString() === req.user.userId
        );

        if (alreadyJoined) {
            return res.status(400).json({ error: 'Déjà dans ce jeu' });
        }

        // Vérifier la limite de joueurs
        if (game.players.length >= game.settings.maxPlayers) {
            return res.status(400).json({ error: 'Jeu complet' });
        }

        // Ajouter le joueur
        game.players.push({
            userId: req.user.userId,
            team: game.mode === 'team' ? team || 'blue' : 'none',
            score: 0
        });

        // Enregistrer l'événement
        game.events.push({
            type: 'join',
            userId: req.user.userId,
            data: { team: team || 'none' }
        });

        await game.save();

        res.json({
            message: 'Jeu rejoint',
            game
        });

    } catch (error) {
        console.error('Erreur rejoindre jeu:', error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription au jeu' });
    }
});

// Démarrer un jeu
router.post('/:gameId/start', async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId);

        if (!game) {
            return res.status(404).json({ error: 'Jeu non trouvé' });
        }

        if (game.creator.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Seul le créateur peut démarrer le jeu' });
        }

        if (game.status !== 'waiting') {
            return res.status(400).json({ error: 'Ce jeu a déjà commencé' });
        }

        game.status = 'active';
        game.startTime = new Date();

        await game.save();

        res.json({
            message: 'Jeu démarré',
            game
        });

    } catch (error) {
        console.error('Erreur démarrer jeu:', error);
        res.status(500).json({ error: 'Erreur lors du démarrage du jeu' });
    }
});

// Capturer une zone
router.post('/:gameId/capture', async (req, res) => {
    try {
        const { zoneId } = req.body;
        const game = await Game.findById(req.params.gameId);

        if (!game) {
            return res.status(404).json({ error: 'Jeu non trouvé' });
        }

        if (game.status !== 'active') {
            return res.status(400).json({ error: 'Le jeu n\'est pas actif' });
        }

        const player = game.players.find(
            p => p.userId.toString() === req.user.userId
        );

        if (!player) {
            return res.status(403).json({ error: 'Vous ne participez pas à ce jeu' });
        }

        const zone = game.zones.find(z => z.id === zoneId);

        if (!zone) {
            return res.status(404).json({ error: 'Zone non trouvée' });
        }

        // Mettre à jour la zone
        zone.owner = req.user.userId;
        zone.team = player.team;
        zone.capturedAt = new Date();

        // Mettre à jour le score
        player.score += zone.points;
        if (!player.capturedZones.includes(zoneId)) {
            player.capturedZones.push(zoneId);
        }

        // Mettre à jour les scores d'équipe
        if (player.team !== 'none') {
            game.scores[player.team] += zone.points;
        }

        // Enregistrer l'événement
        game.events.push({
            type: 'capture',
            userId: req.user.userId,
            data: { zoneId, team: player.team, points: zone.points }
        });

        await game.save();

        res.json({
            message: 'Zone capturée !',
            zone,
            score: player.score,
            teamScores: game.scores
        });

    } catch (error) {
        console.error('Erreur capture zone:', error);
        res.status(500).json({ error: 'Erreur lors de la capture' });
    }
});

// Atteindre un checkpoint
router.post('/:gameId/checkpoint', async (req, res) => {
    try {
        const { checkpointId, time } = req.body;
        const game = await Game.findById(req.params.gameId);

        if (!game) {
            return res.status(404).json({ error: 'Jeu non trouvé' });
        }

        const checkpoint = game.checkpoints.find(c => c.id === checkpointId);

        if (!checkpoint) {
            return res.status(404).json({ error: 'Checkpoint non trouvé' });
        }

        // Vérifier si déjà atteint
        const alreadyReached = checkpoint.reachedBy.some(
            r => r.userId.toString() === req.user.userId
        );

        if (alreadyReached) {
            return res.status(400).json({ error: 'Checkpoint déjà atteint' });
        }

        checkpoint.reachedBy.push({
            userId: req.user.userId,
            time,
            timestamp: new Date()
        });

        // Enregistrer l'événement
        game.events.push({
            type: 'checkpoint',
            userId: req.user.userId,
            data: { checkpointId, time }
        });

        await game.save();

        res.json({
            message: 'Checkpoint atteint !',
            checkpoint,
            position: checkpoint.reachedBy.length
        });

    } catch (error) {
        console.error('Erreur checkpoint:', error);
        res.status(500).json({ error: 'Erreur lors de l\'enregistrement' });
    }
});

// Terminer un jeu
router.post('/:gameId/end', async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId);

        if (!game) {
            return res.status(404).json({ error: 'Jeu non trouvé' });
        }

        game.status = 'completed';
        game.endTime = new Date();

        // Déterminer le gagnant
        if (game.mode === 'team') {
            const winningTeam = game.scores.red > game.scores.blue ? 'red' : 'blue';
            game.winner = {
                type: 'team',
                team: winningTeam
            };

            // Récompenser les joueurs de l'équipe gagnante
            const winners = game.players.filter(p => p.team === winningTeam);

            for (const player of winners) {
                const user = await User.findById(player.userId);
                user.addXP(100);
                user.addCoins(50);
                await user.save();
            }
        } else {
            // Mode solo - le joueur avec le plus de points gagne
            const winner = game.players.reduce((max, p) =>
                p.score > max.score ? p : max
            );

            game.winner = {
                type: 'player',
                id: winner.userId
            };

            const user = await User.findById(winner.userId);
            user.addXP(150);
            user.addCoins(75);
            await user.save();
        }

        await game.save();

        res.json({
            message: 'Jeu terminé',
            game,
            winner: game.winner
        });

    } catch (error) {
        console.error('Erreur fin jeu:', error);
        res.status(500).json({ error: 'Erreur lors de la fin du jeu' });
    }
});

// Obtenir l'historique des jeux
router.get('/history', async (req, res) => {
    try {
        const { limit = 20 } = req.query;

        const games = await Game.find({
            'players.userId': req.user.userId,
            status: 'completed'
        })
            .populate('creator', 'username profile.avatar')
            .populate('players.userId', 'username profile.avatar')
            .sort('-endTime')
            .limit(parseInt(limit));

        res.json({ games });

    } catch (error) {
        console.error('Erreur historique jeux:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
    }
});

module.exports = router;

