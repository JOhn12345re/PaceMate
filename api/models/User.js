/**
 * Modèle utilisateur MongoDB
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profile: {
        avatar: {
            type: String,
            default: '👤'
        },
        level: {
            type: Number,
            default: 1
        },
        xp: {
            type: Number,
            default: 0
        },
        coins: {
            type: Number,
            default: 0
        },
        totalDistance: {
            type: Number,
            default: 0
        },
        totalRuns: {
            type: Number,
            default: 0
        },
        totalTime: {
            type: Number,
            default: 0
        },
        averagePace: {
            type: Number,
            default: 0
        },
        badges: [{
            id: String,
            name: String,
            icon: String,
            dateEarned: Date
        }],
        inventory: [{
            itemId: String,
            quantity: Number
        }]
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    friendRequests: [{
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    settings: {
        privacy: {
            type: String,
            enum: ['public', 'friends', 'private'],
            default: 'public'
        },
        notifications: {
            type: Boolean,
            default: true
        },
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        }
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        },
        lastUpdated: Date
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index géospatial pour les requêtes de proximité
userSchema.index({ location: '2dsphere' });

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour obtenir le profil public
userSchema.methods.getPublicProfile = function() {
    return {
        id: this._id,
        username: this.username,
        profile: {
            avatar: this.profile.avatar,
            level: this.profile.level,
            badges: this.profile.badges,
            totalDistance: this.profile.totalDistance,
            totalRuns: this.profile.totalRuns
        },
        isOnline: this.isOnline
    };
};

// Méthode pour ajouter de l'XP
userSchema.methods.addXP = function(amount) {
    this.profile.xp += amount;

    // Calcul du niveau
    const newLevel = Math.floor(Math.sqrt(this.profile.xp / 100)) + 1;
    const leveledUp = newLevel > this.profile.level;

    if (leveledUp) {
        this.profile.level = newLevel;
        this.profile.coins += 50; // Bonus de niveau
    }

    return { leveledUp, newLevel: this.profile.level };
};

// Méthode pour ajouter des pièces
userSchema.methods.addCoins = function(amount) {
    this.profile.coins += amount;
};

// Méthode pour ajouter un badge
userSchema.methods.addBadge = function(badge) {
    const exists = this.profile.badges.some(b => b.id === badge.id);
    if (!exists) {
        this.profile.badges.push({
            ...badge,
            dateEarned: new Date()
        });
        return true;
    }
    return false;
};

module.exports = mongoose.model('User', userSchema);

