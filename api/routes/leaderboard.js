/**
 * Routes de classement
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Run = require('../models/Run');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// Classement global
router.get('/global', async (req, res) => {
    try {
        const { period = 'allTime', limit = 50 } = req.query;

        const query = {};
        const sortField = 'profile.totalDistance';

        if (period === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);

            const weeklyStats = await Run.aggregate([
                {
                    $match: {
                        startTime: { $gte: weekAgo }
                    }
                },
                {
                    $group: {
                        _id: '$userId',
                        totalDistance: { $sum: '$distance' },
                        totalRuns: { $sum: 1 },
                        totalTime: { $sum: '$duration' }
                    }
                },
                {
                    $sort: { totalDistance: -1 }
                },
                {
                    $limit: parseInt(limit)
                }
            ]);

            const userIds = weeklyStats.map(stat => stat._id);
            const users = await User.find({ _id: { $in: userIds } })
                .select('username profile.avatar profile.level');

            const leaderboard = weeklyStats.map((stat, index) => {
                const user = users.find(u => u._id.toString() === stat._id.toString());
                return {
                    rank: index + 1,
                    user: user ? user.getPublicProfile() : null,
                    stats: {
                        distance: stat.totalDistance,
                        runs: stat.totalRuns,
                        time: stat.totalTime
                    }
                };
            });

            return res.json({ leaderboard, period });
        }

        // Classement tous temps
        const users = await User.find(query)
            .sort({ [sortField]: -1 })
            .limit(parseInt(limit))
            .select('username profile.avatar profile.level profile.totalDistance profile.totalRuns');

        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            user: user.getPublicProfile(),
            stats: {
                distance: user.profile.totalDistance,
                runs: user.profile.totalRuns
            }
        }));

        res.json({ leaderboard, period });

    } catch (error) {
        console.error('Erreur classement global:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du classement' });
    }
});

// Classement local (utilisateurs proches)
router.get('/local', async (req, res) => {
    try {
        const { longitude, latitude, radius = 10000, limit = 50 } = req.query;

        if (!longitude || !latitude) {
            return res.status(400).json({ error: 'Coordonnées requises' });
        }

        const users = await User.find({
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
            .sort({ 'profile.totalDistance': -1 })
            .limit(parseInt(limit))
            .select('username profile.avatar profile.level profile.totalDistance profile.totalRuns location');

        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            user: user.getPublicProfile(),
            stats: {
                distance: user.profile.totalDistance,
                runs: user.profile.totalRuns
            },
            location: user.location
        }));

        res.json({ leaderboard });

    } catch (error) {
        console.error('Erreur classement local:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du classement local' });
    }
});

// Classement des amis
router.get('/friends', async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const friendIds = [...user.friends, req.user.userId];

        const friends = await User.find({
            _id: { $in: friendIds }
        })
            .sort({ 'profile.totalDistance': -1 })
            .select('username profile.avatar profile.level profile.totalDistance profile.totalRuns');

        const leaderboard = friends.map((friend, index) => ({
            rank: index + 1,
            user: friend.getPublicProfile(),
            stats: {
                distance: friend.profile.totalDistance,
                runs: friend.profile.totalRuns
            },
            isCurrentUser: friend._id.toString() === req.user.userId
        }));

        res.json({ leaderboard });

    } catch (error) {
        console.error('Erreur classement amis:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du classement des amis' });
    }
});

// Position de l'utilisateur dans le classement
router.get('/my-rank', async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        // Compter les utilisateurs avec plus de distance
        const rank = await User.countDocuments({
            'profile.totalDistance': { $gt: user.profile.totalDistance }
        }) + 1;

        const totalUsers = await User.countDocuments();

        res.json({
            rank,
            totalUsers,
            percentile: ((totalUsers - rank) / totalUsers * 100).toFixed(1)
        });

    } catch (error) {
        console.error('Erreur rang utilisateur:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du rang' });
    }
});

module.exports = router;

