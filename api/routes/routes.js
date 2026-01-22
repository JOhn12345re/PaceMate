/**
 * Routes d'itinéraires
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// Modèle pour les itinéraires sauvegardés
const mongoose = require('mongoose');

const savedRouteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: String,
    start: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: [Number],
        address: String
    },
    end: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: [Number],
        address: String
    },
    waypoints: [{
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: [Number],
        address: String
    }],
    route: {
        type: {
            type: String,
            enum: ['LineString'],
            default: 'LineString'
        },
        coordinates: [[Number]]
    },
    distance: Number,
    estimatedTime: Number,
    calories: Number,
    difficulty: {
        type: String,
        enum: ['facile', 'moyen', 'difficile'],
        default: 'moyen'
    },
    terrain: {
        type: String,
        enum: ['route', 'piste', 'trail', 'mixte'],
        default: 'route'
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tags: [String],
    timesUsed: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

savedRouteSchema.index({ 'start.coordinates': '2dsphere' });
savedRouteSchema.index({ userId: 1, createdAt: -1 });

const SavedRoute = mongoose.model('SavedRoute', savedRouteSchema);

router.use(authenticate);

// Créer/sauvegarder un itinéraire
router.post('/', async (req, res) => {
    try {
        const routeData = {
            ...req.body,
            userId: req.user.userId
        };

        const savedRoute = new SavedRoute(routeData);
        await savedRoute.save();

        res.status(201).json({
            message: 'Itinéraire sauvegardé',
            route: savedRoute
        });

    } catch (error) {
        console.error('Erreur sauvegarde itinéraire:', error);
        res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
    }
});

// Obtenir les itinéraires de l'utilisateur
router.get('/my', async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query;

        const routes = await SavedRoute.find({ userId: req.user.userId })
            .sort('-createdAt')
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        res.json({ routes });

    } catch (error) {
        console.error('Erreur récupération itinéraires:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
});

// Obtenir un itinéraire par ID
router.get('/:routeId', async (req, res) => {
    try {
        const route = await SavedRoute.findById(req.params.routeId)
            .populate('userId', 'username profile.avatar profile.level');

        if (!route) {
            return res.status(404).json({ error: 'Itinéraire non trouvé' });
        }

        // Vérifier la confidentialité
        if (!route.isPublic && route.userId._id.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Accès refusé' });
        }

        res.json({ route });

    } catch (error) {
        console.error('Erreur récupération itinéraire:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
});

// Rechercher des itinéraires publics
router.get('/search/public', async (req, res) => {
    try {
        const { latitude, longitude, radius = 10000, difficulty, terrain, limit = 20 } = req.query;

        const query = { isPublic: true };

        if (latitude && longitude) {
            query['start.coordinates'] = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(radius)
                }
            };
        }

        if (difficulty) {
            query.difficulty = difficulty;
        }

        if (terrain) {
            query.terrain = terrain;
        }

        const routes = await SavedRoute.find(query)
            .populate('userId', 'username profile.avatar')
            .sort('-timesUsed')
            .limit(parseInt(limit));

        res.json({ routes });

    } catch (error) {
        console.error('Erreur recherche itinéraires:', error);
        res.status(500).json({ error: 'Erreur lors de la recherche' });
    }
});

// Mettre à jour un itinéraire
router.patch('/:routeId', async (req, res) => {
    try {
        const route = await SavedRoute.findOne({
            _id: req.params.routeId,
            userId: req.user.userId
        });

        if (!route) {
            return res.status(404).json({ error: 'Itinéraire non trouvé' });
        }

        const allowedUpdates = ['name', 'description', 'isPublic', 'difficulty', 'terrain', 'tags'];

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                route[key] = req.body[key];
            }
        });

        await route.save();

        res.json({
            message: 'Itinéraire mis à jour',
            route
        });

    } catch (error) {
        console.error('Erreur mise à jour itinéraire:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});

// Supprimer un itinéraire
router.delete('/:routeId', async (req, res) => {
    try {
        const route = await SavedRoute.findOneAndDelete({
            _id: req.params.routeId,
            userId: req.user.userId
        });

        if (!route) {
            return res.status(404).json({ error: 'Itinéraire non trouvé' });
        }

        res.json({ message: 'Itinéraire supprimé' });

    } catch (error) {
        console.error('Erreur suppression itinéraire:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

// Liker un itinéraire
router.post('/:routeId/like', async (req, res) => {
    try {
        const route = await SavedRoute.findById(req.params.routeId);

        if (!route) {
            return res.status(404).json({ error: 'Itinéraire non trouvé' });
        }

        const alreadyLiked = route.likes.includes(req.user.userId);

        if (alreadyLiked) {
            route.likes = route.likes.filter(id => id.toString() !== req.user.userId);
        } else {
            route.likes.push(req.user.userId);
        }

        await route.save();

        res.json({
            message: alreadyLiked ? 'Like retiré' : 'Itinéraire liké',
            likes: route.likes.length
        });

    } catch (error) {
        console.error('Erreur like itinéraire:', error);
        res.status(500).json({ error: 'Erreur lors du like' });
    }
});

// Utiliser un itinéraire (incrémenter le compteur)
router.post('/:routeId/use', async (req, res) => {
    try {
        const route = await SavedRoute.findById(req.params.routeId);

        if (!route) {
            return res.status(404).json({ error: 'Itinéraire non trouvé' });
        }

        route.timesUsed += 1;
        await route.save();

        res.json({ message: 'Compteur mis à jour' });

    } catch (error) {
        console.error('Erreur utilisation itinéraire:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});

module.exports = router;

