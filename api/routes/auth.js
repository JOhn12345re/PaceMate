/**
 * Routes d'authentification
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Inscription
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'Email ou nom d\'utilisateur déjà utilisé'
            });
        }

        // Créer l'utilisateur
        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        // Générer le token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Inscription réussie',
            token,
            user: user.getPublicProfile()
        });

    } catch (error) {
        console.error('Erreur inscription:', error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
});

// Connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        // Trouver l'utilisateur
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Vérifier le mot de passe
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Mettre à jour le statut en ligne
        user.isOnline = true;
        user.lastSeen = new Date();
        await user.save();

        // Générer le token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Connexion réussie',
            token,
            user: user.getPublicProfile()
        });

    } catch (error) {
        console.error('Erreur connexion:', error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});

// Déconnexion
router.post('/logout', async (req, res) => {
    try {
        const userId = req.user.userId; // Middleware d'authentification

        const user = await User.findById(userId);
        if (user) {
            user.isOnline = false;
            user.lastSeen = new Date();
            await user.save();
        }

        res.json({ message: 'Déconnexion réussie' });

    } catch (error) {
        console.error('Erreur déconnexion:', error);
        res.status(500).json({ error: 'Erreur lors de la déconnexion' });
    }
});

// Vérification du token
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token manquant' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }

        res.json({
            valid: true,
            user: user.getPublicProfile()
        });

    } catch (error) {
        res.status(401).json({ error: 'Token invalide' });
    }
});

module.exports = router;

