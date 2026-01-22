/**
 * Routes de courses
 */

const express = require('express');
const router = express.Router();
const Run = require('../models/Run');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// Créer une nouvelle course
router.post('/', async (req, res) => {
    try {
        const runData = {
            ...req.body,
            userId: req.user.userId
        };

        const run = new Run(runData);
        await run.save();

        // Mettre à jour les stats de l'utilisateur
        const user = await User.findById(req.user.userId);
        user.profile.totalDistance += run.distance;
        user.profile.totalRuns += 1;
        user.profile.totalTime += run.duration;

        // Calculer la pace moyenne
        user.profile.averagePace = user.profile.totalTime / user.profile.totalDistance;

        // Ajouter XP et pièces
        const xpEarned = Math.floor(run.distance / 100) * 10;
        const coinsEarned = Math.floor(run.distance / 1000) * 5;

        const levelInfo = user.addXP(xpEarned);
        user.addCoins(coinsEarned);

        run.xpEarned = xpEarned;
        run.coinsEarned = coinsEarned;

        await run.save();
        await user.save();

        res.status(201).json({
            message: 'Course enregistrée',
            run,
            rewards: {
                xp: xpEarned,
                coins: coinsEarned,
                leveledUp: levelInfo.leveledUp,
                newLevel: levelInfo.newLevel
            }
        });

    } catch (error) {
        console.error('Erreur création course:', error);
        res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la course' });
    }
});

// Obtenir les courses de l'utilisateur
router.get('/my', async (req, res) => {
    try {
        const { limit = 20, skip = 0, sort = '-startTime' } = req.query;

        const runs = await Run.find({ userId: req.user.userId })
            .sort(sort)
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await Run.countDocuments({ userId: req.user.userId });

        res.json({
            runs,
            total,
            page: Math.floor(skip / limit) + 1,
            totalPages: Math.ceil(total / limit)
        });

    } catch (error) {
        console.error('Erreur récupération courses:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des courses' });
    }
});

// Obtenir une course par ID
router.get('/:runId', async (req, res) => {
    try {
        const run = await Run.findById(req.params.runId)
            .populate('userId', 'username profile.avatar profile.level');

        if (!run) {
            return res.status(404).json({ error: 'Course non trouvée' });
        }

        // Vérifier la confidentialité
        if (!run.isPublic && run.userId._id.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Accès refusé' });
        }

        res.json({ run });

    } catch (error) {
        console.error('Erreur récupération course:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la course' });
    }
});

// Obtenir le fil d'actualité des courses
router.get('/feed', async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query;

        const user = await User.findById(req.user.userId);
        const friendIds = user.friends;

        const runs = await Run.find({
            $or: [
                { userId: req.user.userId },
                { userId: { $in: friendIds }, isPublic: true }
            ]
        })
            .populate('userId', 'username profile.avatar profile.level')
            .sort('-startTime')
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        res.json({ runs });

    } catch (error) {
        console.error('Erreur fil d\'actualité:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du fil' });
    }
});

// Liker une course
router.post('/:runId/like', async (req, res) => {
    try {
        const run = await Run.findById(req.params.runId);

        if (!run) {
            return res.status(404).json({ error: 'Course non trouvée' });
        }

        const alreadyLiked = run.likes.includes(req.user.userId);

        if (alreadyLiked) {
            // Retirer le like
            run.likes = run.likes.filter(id => id.toString() !== req.user.userId);
        } else {
            // Ajouter le like
            run.likes.push(req.user.userId);
        }

        await run.save();

        res.json({
            message: alreadyLiked ? 'Like retiré' : 'Course likée',
            likes: run.likes.length
        });

    } catch (error) {
        console.error('Erreur like:', error);
        res.status(500).json({ error: 'Erreur lors du like' });
    }
});

// Commenter une course
router.post('/:runId/comment', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Commentaire requis' });
        }

        const run = await Run.findById(req.params.runId);

        if (!run) {
            return res.status(404).json({ error: 'Course non trouvée' });
        }

        run.comments.push({
            userId: req.user.userId,
            text,
            date: new Date()
        });

        await run.save();

        const populatedRun = await Run.findById(run._id)
            .populate('comments.userId', 'username profile.avatar');

        res.json({
            message: 'Commentaire ajouté',
            comments: populatedRun.comments
        });

    } catch (error) {
        console.error('Erreur commentaire:', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du commentaire' });
    }
});

// Statistiques de l'utilisateur
router.get('/stats/summary', async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        // Statistiques des 30 derniers jours
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentRuns = await Run.find({
            userId: req.user.userId,
            startTime: { $gte: thirtyDaysAgo }
        });

        const totalDistance30d = recentRuns.reduce((sum, run) => sum + run.distance, 0);
        const totalDuration30d = recentRuns.reduce((sum, run) => sum + run.duration, 0);
        const totalRuns30d = recentRuns.length;

        res.json({
            allTime: {
                totalDistance: user.profile.totalDistance,
                totalRuns: user.profile.totalRuns,
                totalTime: user.profile.totalTime,
                averagePace: user.profile.averagePace
            },
            last30Days: {
                totalDistance: totalDistance30d,
                totalRuns: totalRuns30d,
                totalTime: totalDuration30d,
                averagePace: totalRuns30d > 0 ? totalDuration30d / totalDistance30d : 0
            }
        });

    } catch (error) {
        console.error('Erreur statistiques:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
});

module.exports = router;

