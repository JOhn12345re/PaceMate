/**
 * Modèle de course MongoDB
 */

const mongoose = require('mongoose');

const runSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    route: {
        type: {
            type: String,
            enum: ['LineString'],
            default: 'LineString'
        },
        coordinates: [[Number]] // Array de [longitude, latitude]
    },
    startLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: [Number]
    },
    endLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: [Number]
    },
    distance: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    pace: {
        type: Number,
        required: true
    },
    averageSpeed: {
        type: Number,
        required: true
    },
    calories: {
        type: Number,
        default: 0
    },
    elevationGain: {
        type: Number,
        default: 0
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    weatherConditions: {
        temperature: Number,
        conditions: String,
        humidity: Number
    },
    stats: {
        maxSpeed: Number,
        minPace: Number,
        maxPace: Number,
        splits: [{
            km: Number,
            time: Number,
            pace: Number
        }]
    },
    achievements: [{
        type: String
    }],
    xpEarned: {
        type: Number,
        default: 0
    },
    coinsEarned: {
        type: Number,
        default: 0
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: String,
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Index pour les requêtes géospatiales
runSchema.index({ route: '2dsphere' });
runSchema.index({ userId: 1, startTime: -1 });

module.exports = mongoose.model('Run', runSchema);

