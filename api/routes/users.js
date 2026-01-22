/**
 * Routes utilisateurs
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// Middleware d'authentification pour toutes les routes
router.use(authenticate);

// Obtenir le profil de l'utilisateur connecté
router.get('/me', async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.json({ user });

    } catch (error) {
        console.error('Erreur profil:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
    }
});

// Mettre à jour le profil
router.patch('/me', async (req, res) => {
    try {
        const updates = req.body;
        const allowedUpdates = ['profile', 'settings'];

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Appliquer les mises à jour
        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                if (typeof updates[key] === 'object') {
                    user[key] = { ...user[key], ...updates[key] };
                } else {
                    user[key] = updates[key];
                }
            }
        });

        await user.save();

        res.json({
            message: 'Profil mis à jour',
            user
        });

    } catch (error) {
        console.error('Erreur mise à jour profil:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
    }
});

// Obtenir un utilisateur par ID
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.json({ user: user.getPublicProfile() });

    } catch (error) {
        console.error('Erreur utilisateur:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
});

// Rechercher des utilisateurs
router.get('/search', async (req, res) => {
    try {
        const { q, limit = 20 } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Paramètre de recherche requis' });
        }

        const users = await User.find({
            $or: [
                { username: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        })
            .limit(parseInt(limit))
            .select('username profile.avatar profile.level isOnline');

        res.json({ users });

    } catch (error) {
        console.error('Erreur recherche:', error);
        res.status(500).json({ error: 'Erreur lors de la recherche' });
    }
});

// Obtenir les utilisateurs proches
router.get('/nearby', async (req, res) => {
    try {
        const { longitude, latitude, radius = 5000 } = req.query;

        if (!longitude || !latitude) {
            return res.status(400).json({ error: 'Coordonnées requises' });
        }

        const users = await User.find({
            _id: { $ne: req.user.userId },
            isOnline: true,
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(radius)
                }
            }
        })
            .limit(50)
            .select('username profile.avatar profile.level location isOnline');

        res.json({ users });

    } catch (error) {
        console.error('Erreur utilisateurs proches:', error);
        res.status(500).json({ error: 'Erreur lors de la recherche des utilisateurs proches' });
    }
});

// Mettre à jour la position
router.post('/location', async (req, res) => {
    try {
        const { longitude, latitude } = req.body;

        if (!longitude || !latitude) {
            return res.status(400).json({ error: 'Coordonnées requises' });
        }

        const user = await User.findById(req.user.userId);

        user.location = {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
            lastUpdated: new Date()
        };

        await user.save();

        res.json({ message: 'Position mise à jour' });

    } catch (error) {
        console.error('Erreur position:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la position' });
    }
});

// Ajouter un ami
router.post('/friends/request/:userId', async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.userId);
        const currentUser = await User.findById(req.user.userId);

        if (!targetUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Vérifier si déjà ami
        if (currentUser.friends.includes(targetUser._id)) {
            return res.status(400).json({ error: 'Déjà ami avec cet utilisateur' });
        }

        // Vérifier si demande déjà envoyée
        const requestExists = targetUser.friendRequests.some(
            req => req.from.toString() === currentUser._id.toString()
        );

        if (requestExists) {
            return res.status(400).json({ error: 'Demande déjà envoyée' });
        }

        // Ajouter la demande
        targetUser.friendRequests.push({ from: currentUser._id });
        await targetUser.save();

        res.json({ message: 'Demande d\'ami envoyée' });

    } catch (error) {
        console.error('Erreur demande ami:', error);
        res.status(500).json({ error: 'Erreur lors de l\'envoi de la demande' });
    }
});

// Accepter une demande d'ami
router.post('/friends/accept/:userId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.userId);
        const friendUser = await User.findById(req.params.userId);

        if (!friendUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Retirer la demande
        currentUser.friendRequests = currentUser.friendRequests.filter(
            req => req.from.toString() !== friendUser._id.toString()
        );

        // Ajouter comme amis
        currentUser.friends.push(friendUser._id);
        friendUser.friends.push(currentUser._id);

        await currentUser.save();
        await friendUser.save();

        res.json({ message: 'Ami ajouté' });

    } catch (error) {
        console.error('Erreur acceptation ami:', error);
        res.status(500).json({ error: 'Erreur lors de l\'acceptation' });
    }
});

// Obtenir la liste d'amis
router.get('/friends', async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .populate('friends', 'username profile.avatar profile.level isOnline');

        res.json({ friends: user.friends });

    } catch (error) {
        console.error('Erreur liste amis:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des amis' });
    }
});

module.exports = router;

