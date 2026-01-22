/**
 * Routes de défis
 */

const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// Obtenir les défis actifs
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;

        const query = {
            isActive: true,
            endDate: { $gte: new Date() }
        };

        if (type) {
            query.type = type;
        }

        const challenges = await Challenge.find(query)
            .sort({ startDate: -1 });

        // Ajouter la progression de l'utilisateur
        const challengesWithProgress = challenges.map(challenge => {
            const participant = challenge.participants.find(
                p => p.userId.toString() === req.user.userId
            );

            return {
                ...challenge.toObject(),
                userProgress: participant ? {
                    progress: participant.progress,
                    completed: participant.completed
                } : null,
                participantCount: challenge.participants.length
            };
        });

        res.json({ challenges: challengesWithProgress });

    } catch (error) {
        console.error('Erreur récupération défis:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des défis' });
    }
});

// Rejoindre un défi
router.post('/:challengeId/join', async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.challengeId);

        if (!challenge) {
            return res.status(404).json({ error: 'Défi non trouvé' });
        }

        if (!challenge.isActive) {
            return res.status(400).json({ error: 'Ce défi n\'est plus actif' });
        }

        if (challenge.endDate < new Date()) {
            return res.status(400).json({ error: 'Ce défi est terminé' });
        }

        // Vérifier si déjà participant
        const alreadyParticipant = challenge.participants.some(
            p => p.userId.toString() === req.user.userId
        );

        if (alreadyParticipant) {
            return res.status(400).json({ error: 'Déjà inscrit à ce défi' });
        }

        // Vérifier la limite de participants
        if (challenge.maxParticipants &&
            challenge.participants.length >= challenge.maxParticipants) {
            return res.status(400).json({ error: 'Défi complet' });
        }

        // Ajouter le participant
        challenge.participants.push({
            userId: req.user.userId,
            progress: 0,
            completed: false
        });

        await challenge.save();

        res.json({
            message: 'Défi rejoint avec succès',
            challenge
        });

    } catch (error) {
        console.error('Erreur rejoindre défi:', error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription au défi' });
    }
});

// Mettre à jour la progression d'un défi
router.post('/:challengeId/progress', async (req, res) => {
    try {
        const { progress } = req.body;
        const challenge = await Challenge.findById(req.params.challengeId);

        if (!challenge) {
            return res.status(404).json({ error: 'Défi non trouvé' });
        }

        const participant = challenge.participants.find(
            p => p.userId.toString() === req.user.userId
        );

        if (!participant) {
            return res.status(400).json({ error: 'Vous ne participez pas à ce défi' });
        }

        // Mettre à jour la progression
        participant.progress = progress;

        // Vérifier si le défi est complété
        if (progress >= challenge.goal.target && !participant.completed) {
            participant.completed = true;
            participant.completedAt = new Date();

            // Récompenser l'utilisateur
            const user = await User.findById(req.user.userId);

            user.addXP(challenge.rewards.xp);
            user.addCoins(challenge.rewards.coins);

            if (challenge.rewards.badge) {
                user.addBadge(challenge.rewards.badge);
            }

            await user.save();

            await challenge.save();

            return res.json({
                message: 'Défi complété ! 🎉',
                completed: true,
                rewards: challenge.rewards,
                challenge
            });
        }

        await challenge.save();

        res.json({
            message: 'Progression mise à jour',
            progress: participant.progress,
            target: challenge.goal.target,
            challenge
        });

    } catch (error) {
        console.error('Erreur progression défi:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});

// Obtenir les défis complétés par l'utilisateur
router.get('/completed', async (req, res) => {
    try {
        const challenges = await Challenge.find({
            'participants.userId': req.user.userId,
            'participants.completed': true
        });

        res.json({ challenges });

    } catch (error) {
        console.error('Erreur défis complétés:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
});

// Créer un défi (admin uniquement)
router.post('/', async (req, res) => {
    try {
        // TODO: Ajouter vérification admin
        const challenge = new Challenge(req.body);
        await challenge.save();

        res.status(201).json({
            message: 'Défi créé',
            challenge
        });

    } catch (error) {
        console.error('Erreur création défi:', error);
        res.status(500).json({ error: 'Erreur lors de la création du défi' });
    }
});

module.exports = router;

