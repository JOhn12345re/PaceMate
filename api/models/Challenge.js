/**
 * Modèle de défi MongoDB
 */

const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['daily', 'weekly', 'special', 'community'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    goal: {
        type: {
            type: String,
            enum: ['distance', 'duration', 'runs', 'pace', 'elevation'],
            required: true
        },
        target: {
            type: Number,
            required: true
        },
        unit: String
    },
    rewards: {
        xp: {
            type: Number,
            default: 0
        },
        coins: {
            type: Number,
            default: 0
        },
        badge: {
            id: String,
            name: String,
            icon: String
        }
    },
    participants: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        progress: {
            type: Number,
            default: 0
        },
        completed: {
            type: Boolean,
            default: false
        },
        completedAt: Date
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['facile', 'moyen', 'difficile', 'expert'],
        default: 'moyen'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    maxParticipants: {
        type: Number,
        default: null
    }
}, {
    timestamps: true
});

// Index pour les requêtes
challengeSchema.index({ type: 1, isActive: 1, endDate: -1 });

module.exports = mongoose.model('Challenge', challengeSchema);

