/**
 * Modèle de mini-jeu MongoDB
 */

const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    gameType: {
        type: String,
        enum: [
            'capture-de-zones',
            'course-aux-checkpoints',
            'roi-de-la-colline',
            'chasse-au-tresor',
            'relais-par-equipe',
            'defense-de-zone'
        ],
        required: true
    },
    mode: {
        type: String,
        enum: ['solo', 'team'],
        required: true
    },
    status: {
        type: String,
        enum: ['waiting', 'active', 'completed', 'cancelled'],
        default: 'waiting'
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    players: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        team: {
            type: String,
            enum: ['red', 'blue', 'none'],
            default: 'none'
        },
        score: {
            type: Number,
            default: 0
        },
        capturedZones: [String],
        powerUps: [String],
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    zones: [{
        id: String,
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: [Number]
        },
        radius: Number,
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        team: String,
        points: Number,
        capturedAt: Date
    }],
    checkpoints: [{
        id: String,
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: [Number]
        },
        order: Number,
        reachedBy: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            time: Number,
            timestamp: Date
        }]
    }],
    treasures: [{
        id: String,
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: [Number]
        },
        value: Number,
        foundBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        foundAt: Date
    }],
    settings: {
        duration: {
            type: Number,
            default: 1800000 // 30 minutes par défaut
        },
        maxPlayers: {
            type: Number,
            default: 10
        },
        area: {
            center: {
                type: {
                    type: String,
                    enum: ['Point'],
                    default: 'Point'
                },
                coordinates: [Number]
            },
            radius: {
                type: Number,
                default: 1000 // 1km par défaut
            }
        },
        difficulty: {
            type: String,
            enum: ['facile', 'moyen', 'difficile'],
            default: 'moyen'
        }
    },
    scores: {
        red: {
            type: Number,
            default: 0
        },
        blue: {
            type: Number,
            default: 0
        }
    },
    winner: {
        type: {
            type: String,
            enum: ['player', 'team']
        },
        id: mongoose.Schema.Types.ObjectId,
        team: String
    },
    startTime: Date,
    endTime: Date,
    events: [{
        type: {
            type: String,
            enum: ['capture', 'checkpoint', 'treasure', 'powerup', 'join', 'leave']
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        data: mongoose.Schema.Types.Mixed,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Index géospatial
gameSchema.index({ 'settings.area.center': '2dsphere' });
gameSchema.index({ 'zones.location': '2dsphere' });
gameSchema.index({ gameType: 1, status: 1, startTime: -1 });

module.exports = mongoose.model('Game', gameSchema);

