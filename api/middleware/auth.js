/**
 * Middleware d'authentification JWT
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware pour vérifier le token JWT
 */
const authenticate = (req, res, next) => {
    try {
        // Récupérer le token du header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Token d\'authentification manquant' });
        }

        // Format attendu: "Bearer TOKEN"
        const parts = authHeader.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ error: 'Format de token invalide' });
        }

        const token = parts[1];

        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ajouter les infos utilisateur à la requête
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expiré' });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token invalide' });
        }

        return res.status(500).json({ error: 'Erreur d\'authentification' });
    }
};

/**
 * Middleware optionnel - ajoute les infos utilisateur si le token est présent
 */
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const parts = authHeader.split(' ');

            if (parts.length === 2 && parts[0] === 'Bearer') {
                const token = parts[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;
            }
        }

        next();
    } catch (error) {
        // En cas d'erreur, on continue sans authentification
        next();
    }
};

module.exports = {
    authenticate,
    optionalAuth
};

