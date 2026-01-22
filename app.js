// ========================================
// PaceMate - Application de Running Social
// ========================================

// Configuration globale
const CONFIG = {
    map: {
        defaultCenter: [48.8566, 2.3522], // Paris par défaut
        defaultZoom: 13,
        maxDistance: 50 // km
    },
    xp: {
        baseXP: 100,
        levelMultiplier: 1.5
    }
};

// État global de l'application
const APP_STATE = {
    currentUser: {
        name: 'Coureur Anonyme',
        level: 1,
        xp: 0,
        coins: 0,
        totalRuns: 0,
        totalDistance: 0,
        totalTime: 0,
        currentStreak: 0,
        badges: [],
        friends: [],
        purchases: []
    },
    currentLocation: null,
    nearbyRunners: [],
    challenges: {
        daily: [],
        weekly: []
    },
    leaderboard: {
        global: [],
        local: [],
        friends: []
    },
    map: null,
    markers: []
};

// ========================================
// INITIALISATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🏃‍♂️ PaceMate - Initialisation...');

    // Charger les données sauvegardées
    loadUserData();
    loadGameStats();

    // Initialiser la carte
    initMap();

    // Initialiser les événements
    initEventListeners();

    // Générer les données initiales
    generateInitialData();

    // Mettre à jour l'interface
    updateUI();

    // Démarrer les mises à jour périodiques
    startPeriodicUpdates();

    showNotification('🎉 Bienvenue sur PaceMate ! Trouve des coureurs près de toi !');
});

// ========================================
// GESTION DE LA CARTE
// ========================================

function initMap() {
    // Créer la carte Leaflet
    APP_STATE.map = L.map('map').setView(CONFIG.map.defaultCenter, CONFIG.map.defaultZoom);

    // Ajouter le tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(APP_STATE.map);

    // Demander la géolocalisation
    getUserLocation();
}

function getUserLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                APP_STATE.currentLocation = [latitude, longitude];

                // Centrer la carte sur la position de l'utilisateur
                APP_STATE.map.setView(APP_STATE.currentLocation, CONFIG.map.defaultZoom);

                // Ajouter un marqueur pour l'utilisateur
                L.marker(APP_STATE.currentLocation, {
                    icon: createCustomIcon('🎯', 'user-marker')
                }).addTo(APP_STATE.map)
                    .bindPopup('<b>Vous êtes ici !</b>');

                // Générer des coureurs à proximité
                generateNearbyRunners();

                showNotification('📍 Position détectée ! Recherche de coureurs...');
            },
            (error) => {
                console.warn('Géolocalisation non disponible:', error);
                // Utiliser la position par défaut
                APP_STATE.currentLocation = CONFIG.map.defaultCenter;
                generateNearbyRunners();
            }
        );
    } else {
        APP_STATE.currentLocation = CONFIG.map.defaultCenter;
        generateNearbyRunners();
    }
}

function createCustomIcon(emoji, className) {
    return L.divIcon({
        html: `<div class="custom-marker ${className}">${emoji}</div>`,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
}

function generateNearbyRunners() {
    // Nettoyer les marqueurs existants
    APP_STATE.markers.forEach(marker => marker.remove());
    APP_STATE.markers = [];
    APP_STATE.nearbyRunners = [];

    // Générer 15-25 coureurs aléatoires
    const numRunners = Math.floor(Math.random() * 11) + 15;

    for (let i = 0; i < numRunners; i++) {
        const runner = generateRandomRunner();
        APP_STATE.nearbyRunners.push(runner);

        // Ajouter un marqueur sur la carte avec popup amélioré
        const marker = L.marker(runner.location, {
            icon: createCustomIcon('🏃‍♂️', 'runner-marker runner-active')
        }).addTo(APP_STATE.map);

        // Bind popup amélioré
        marker.bindPopup(enhanceRunnerPopup(runner), {
            maxWidth: 300,
            className: 'enhanced-popup'
        });

        // Garde aussi le clic pour la modal
        marker.on('click', () => {
            // Le popup s'affiche automatiquement
            setTimeout(() => {
                // Optionnel: garder la modal pour plus de détails
                // showRunnerModal(runner);
            }, 100);
        });

        APP_STATE.markers.push(marker);
    }

    // Mettre à jour la liste des coureurs
    updateRunnersList();
}

function generateRandomRunner() {
    const names = ['Alex', 'Sophie', 'Thomas', 'Marie', 'Lucas', 'Emma', 'Hugo', 'Léa', 'Arthur', 'Chloé', 'Nathan', 'Camille'];
    const levels = ['Débutant', 'Intermédiaire', 'Avancé', 'Pro'];

    // Générer une position aléatoire dans un rayon de 5km
    const distance = Math.random() * 5;
    const angle = Math.random() * 2 * Math.PI;
    const deltaLat = (distance / 111) * Math.cos(angle);
    const deltaLng = (distance / (111 * Math.cos(APP_STATE.currentLocation[0] * Math.PI / 180))) * Math.sin(angle);

    const location = [
        APP_STATE.currentLocation[0] + deltaLat,
        APP_STATE.currentLocation[1] + deltaLng
    ];

    return {
        id: Math.random().toString(36).substr(2, 9),
        name: names[Math.floor(Math.random() * names.length)],
        level: levels[Math.floor(Math.random() * levels.length)],
        pace: (Math.random() * 3 + 3).toFixed(2), // 3-6 min/km
        distance: distance.toFixed(1),
        location: location,
        streak: Math.floor(Math.random() * 30) + 1,
        totalRuns: Math.floor(Math.random() * 200) + 10,
        xp: Math.floor(Math.random() * 5000) + 100,
        online: Math.random() > 0.3
    };
}

function updateRunnersList() {
    const runnersListEl = document.getElementById('runnersList');
    const runnersCountEl = document.getElementById('runnersCount');

    runnersCountEl.textContent = APP_STATE.nearbyRunners.length;

    runnersListEl.innerHTML = APP_STATE.nearbyRunners.map(runner => `
        <div class="runner-card" onclick="showRunnerModal(${JSON.stringify(runner).replace(/"/g, '&quot;')})">
            <div class="runner-header">
                <div class="runner-avatar">🏃‍♂️</div>
                <div class="runner-info">
                    <h4>${runner.name}</h4>
                    <div class="runner-level">${runner.level} • ${runner.online ? '🟢 En ligne' : '⚫ Hors ligne'}</div>
                </div>
            </div>
            <div class="runner-stats">
                <div class="runner-stat"><strong>Allure:</strong> ${runner.pace} min/km</div>
                <div class="runner-stat"><strong>XP:</strong> ${runner.xp}</div>
                <div class="runner-stat"><strong>Série:</strong> ${runner.streak} jours</div>
                <div class="runner-stat"><strong>Courses:</strong> ${runner.totalRuns}</div>
            </div>
            <div class="runner-distance">📍 ${runner.distance} km de vous</div>
        </div>
    `).join('');

    // Mettre à jour les stats de la carte
    updateMapStats();
}

// ========================================
// FONCTIONNALITÉS AVANCÉES DE LA CARTE
// ========================================

// Variables globales pour la carte
let currentMapStyle = 'default';
let distanceCircles = [];
let routeLines = [];
const heatmapLayer = null;
let isFullscreen = false;

// Variables pour le planificateur d'itinéraire
const ROUTE_PLANNER = {
    isActive: false,
    selectingStart: false,
    selectingEnd: false,
    selectingWaypoint: false,
    startPoint: null,
    endPoint: null,
    waypoints: [],
    currentRoute: null,
    routeMarkers: [],
    savedRoutes: [],
    navigationActive: false
};

// Mettre à jour les statistiques de la carte
function updateMapStats() {
    const onlineRunners = APP_STATE.nearbyRunners.filter(r => r.online).length;
    document.getElementById('visibleRunners').textContent = APP_STATE.nearbyRunners.length;
    document.getElementById('activityLevel').textContent =
        onlineRunners > 15 ? 'Très élevée' : onlineRunners > 10 ? 'Élevée' : onlineRunners > 5 ? 'Moyenne' : 'Faible';

    // Simuler température
    const temp = Math.floor(Math.random() * 15) + 15;
    document.getElementById('weatherTemp').textContent = `${temp  }°C`;
}

// Changer le style de carte
function changeMapStyle(style) {
    currentMapStyle = style;

    // Retirer l'ancien tile layer
    APP_STATE.map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
            APP_STATE.map.removeLayer(layer);
        }
    });

    // Ajouter le nouveau style
    let tileUrl = '';
    let attribution = '© OpenStreetMap contributors';

    switch (style) {
    case 'default':
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        break;
    case 'dark':
        tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        attribution = '© OpenStreetMap, © CARTO';
        break;
    case 'satellite':
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = '© Esri';
        break;
    case 'terrain':
        tileUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg';
        attribution = 'Map tiles by Stamen Design, © OpenStreetMap';
        break;
    case 'streets':
        tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        attribution = '© OpenStreetMap, © CARTO';
        break;
    }

    L.tileLayer(tileUrl, {
        attribution: attribution,
        maxZoom: 19
    }).addTo(APP_STATE.map);

    // Mettre à jour les boutons de style
    document.querySelectorAll('.style-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`[data-style="${style}"]`)?.classList.add('active');

    showNotification(`🎨 Style de carte changé: ${style === 'default' ? 'Standard' : style}`);
}

// Ajouter des cercles de distance
function addDistanceCircles() {
    // Nettoyer les anciens cercles
    distanceCircles.forEach(circle => circle.remove());
    distanceCircles = [];

    if (!APP_STATE.currentLocation) {
        return;
    }

    // Cercles à 1km, 3km, 5km
    const distances = [1000, 3000, 5000];
    const colors = ['#FF6B35', '#4ECDC4', '#FFE66D'];

    distances.forEach((distance, index) => {
        const circle = L.circle(APP_STATE.currentLocation, {
            radius: distance,
            color: colors[index],
            fillColor: colors[index],
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '5, 5'
        }).addTo(APP_STATE.map);

        circle.bindPopup(`📏 Rayon de ${distance/1000} km`);
        distanceCircles.push(circle);
    });

    showNotification('📏 Cercles de distance affichés');
}

// Créer un itinéraire entre deux points
function createRoute(start, end) {
    const route = L.polyline([start, end], {
        color: '#FF6B35',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1
    }).addTo(APP_STATE.map);

    // Ajouter une flèche à la fin
    const decorator = L.polylineDecorator(route, {
        patterns: [
            {
                offset: '100%',
                repeat: 0,
                symbol: L.Symbol.arrowHead({
                    pixelSize: 15,
                    polygon: false,
                    pathOptions: {
                        stroke: true,
                        color: '#FF6B35',
                        weight: 3
                    }
                })
            }
        ]
    }).addTo(APP_STATE.map);

    routeLines.push(route);
    routeLines.push(decorator);

    // Calculer la distance
    const distance = APP_STATE.map.distance(start, end) / 1000;
    route.bindPopup(`🛣️ Distance: ${distance.toFixed(2)} km`);
}

// Afficher des itinéraires suggérés
function showSuggestedRoutes() {
    // Nettoyer les anciennes routes
    routeLines.forEach(line => line.remove());
    routeLines = [];

    if (!APP_STATE.currentLocation || APP_STATE.nearbyRunners.length === 0) {
        showNotification('❌ Aucun coureur à proximité pour créer des itinéraires');
        return;
    }

    // Créer des routes vers les 3 coureurs les plus proches
    const closestRunners = APP_STATE.nearbyRunners
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        .slice(0, 3);

    closestRunners.forEach(runner => {
        createRoute(APP_STATE.currentLocation, runner.location);
    });

    showNotification(`🛣️ ${closestRunners.length} itinéraires suggérés affichés`);
}

// Mode plein écran
function toggleFullscreen() {
    const mapContainer = document.getElementById('map');

    if (!isFullscreen) {
        mapContainer.classList.add('fullscreen');
        isFullscreen = true;
        document.getElementById('fullscreenMap').innerHTML = '⛶ Sortir';
        showNotification('⛶ Mode plein écran activé');
    } else {
        mapContainer.classList.remove('fullscreen');
        isFullscreen = false;
        document.getElementById('fullscreenMap').innerHTML = '⛶ Plein écran';
        showNotification('⛶ Mode plein écran désactivé');
    }

    // Invalider la taille de la carte pour le redimensionnement
    setTimeout(() => {
        APP_STATE.map.invalidateSize();
    }, 300);
}

// Appliquer les filtres de carte
function applyMapFilters() {
    const distanceMax = parseFloat(document.getElementById('distanceFilter').value);
    const paceFilter = document.getElementById('paceFilter').value;
    const levelFilter = document.getElementById('levelFilter').value;

    // Mettre à jour l'affichage de la valeur
    document.getElementById('distanceValue').textContent = `${distanceMax  } km`;

    // Filtrer les coureurs
    let filteredRunners = APP_STATE.nearbyRunners;

    // Filtre de distance
    filteredRunners = filteredRunners.filter(r => parseFloat(r.distance) <= distanceMax);

    // Filtre d'allure
    if (paceFilter !== 'all') {
        const [min, max] = paceFilter.split('-').map(Number);
        filteredRunners = filteredRunners.filter(r => {
            const pace = parseFloat(r.pace);
            return pace >= min && pace <= max;
        });
    }

    // Filtre de niveau
    if (levelFilter !== 'all') {
        filteredRunners = filteredRunners.filter(r =>
            r.level.toLowerCase() === levelFilter.toLowerCase() ||
            r.level.toLowerCase().includes(levelFilter.toLowerCase())
        );
    }

    // Mettre à jour l'affichage
    updateFilteredRunners(filteredRunners);

    showNotification(`🔍 ${filteredRunners.length} coureurs trouvés avec les filtres`);
}

// Mettre à jour l'affichage des coureurs filtrés
function updateFilteredRunners(runners) {
    // Cacher tous les marqueurs
    APP_STATE.markers.forEach(marker => {
        marker.setOpacity(0.3);
    });

    // Afficher uniquement les coureurs filtrés
    runners.forEach(runner => {
        const marker = APP_STATE.markers.find(m =>
            m.getLatLng().lat === runner.location[0] &&
            m.getLatLng().lng === runner.location[1]
        );
        if (marker) {
            marker.setOpacity(1);
        }
    });

    // Mettre à jour le compteur
    document.getElementById('visibleRunners').textContent = runners.length;
}

// Améliorer les popups des coureurs
function enhanceRunnerPopup(runner) {
    return `
        <div class="runner-popup-header">
            <div class="runner-popup-avatar">🏃‍♂️</div>
            <div class="runner-popup-info">
                <h3>${runner.name}</h3>
                <p>${runner.level} • ${runner.online ? '🟢 En ligne' : '⚫ Hors ligne'}</p>
            </div>
        </div>
        <div class="runner-popup-stats">
            <div class="runner-popup-stat">
                <strong>${runner.pace}</strong>
                <span>min/km</span>
            </div>
            <div class="runner-popup-stat">
                <strong>${runner.distance}</strong>
                <span>km de vous</span>
            </div>
            <div class="runner-popup-stat">
                <strong>${runner.streak}</strong>
                <span>jours série</span>
            </div>
            <div class="runner-popup-stat">
                <strong>${runner.totalRuns}</strong>
                <span>courses</span>
            </div>
        </div>
        <div class="runner-popup-actions">
            <button class="btn-primary" onclick="sendRunRequest('${runner.id}')">
                🏃‍♂️ Proposer une course
            </button>
            <button class="btn-secondary" onclick="createRoute([${APP_STATE.currentLocation}], [${runner.location}])">
                🛣️ Itinéraire
            </button>
        </div>
    `;
}

// Régénérer les coureurs avec popups améliorés
function regenerateRunnersWithEnhancedPopups() {
    // Supprimer les anciens marqueurs
    APP_STATE.markers.forEach(marker => marker.remove());
    APP_STATE.markers = [];

    // Recréer les marqueurs avec popups améliorés
    APP_STATE.nearbyRunners.forEach(runner => {
        const marker = L.marker(runner.location, {
            icon: createCustomIcon('🏃‍♂️', 'runner-marker runner-active')
        }).addTo(APP_STATE.map);

        marker.bindPopup(enhanceRunnerPopup(runner), {
            maxWidth: 300,
            className: 'enhanced-popup'
        });

        APP_STATE.markers.push(marker);
    });
}

// ========================================
// MODAL COUREUR
// ========================================

function showRunnerModal(runner) {
    if (typeof runner === 'string') {
        runner = JSON.parse(runner);
    }

    const modal = document.getElementById('runnerModal');
    const modalName = document.getElementById('runnerModalName');
    const modalBody = document.getElementById('runnerModalBody');

    modalName.textContent = runner.name;
    modalBody.innerHTML = `
        <div class="runner-modal-content">
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <div style="font-size: 4rem; margin-bottom: 0.5rem;">🏃‍♂️</div>
                <h4>${runner.level}</h4>
                <p style="color: var(--gray);">${runner.online ? '🟢 En ligne maintenant' : '⚫ Hors ligne'}</p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1rem;">
                <div style="padding: 1rem; background: var(--gray-light); border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.85rem; color: var(--gray);">Allure moyenne</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${runner.pace}</div>
                    <div style="font-size: 0.85rem;">min/km</div>
                </div>
                <div style="padding: 1rem; background: var(--gray-light); border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.85rem; color: var(--gray);">Distance</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${runner.distance}</div>
                    <div style="font-size: 0.85rem;">km de vous</div>
                </div>
                <div style="padding: 1rem; background: var(--gray-light); border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.85rem; color: var(--gray);">Série</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${runner.streak}</div>
                    <div style="font-size: 0.85rem;">jours</div>
                </div>
                <div style="padding: 1rem; background: var(--gray-light); border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.85rem; color: var(--gray);">Courses totales</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${runner.totalRuns}</div>
                    <div style="font-size: 0.85rem;">runs</div>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');

    // Stocker le coureur sélectionné
    APP_STATE.selectedRunner = runner;
}

// ========================================
// SYSTÈME DE GAMIFICATION
// ========================================

function addXP(amount) {
    APP_STATE.currentUser.xp += amount;

    // Vérifier si le joueur monte de niveau
    const xpNeeded = calculateXPForLevel(APP_STATE.currentUser.level);

    if (APP_STATE.currentUser.xp >= xpNeeded) {
        APP_STATE.currentUser.xp -= xpNeeded;
        APP_STATE.currentUser.level++;
        showNotification(`🎉 Niveau ${APP_STATE.currentUser.level} atteint ! +50 coins bonus !`);
        addCoins(50);

        // Débloquer des badges
        checkBadgeUnlocks();
    }

    updateUI();
    saveUserData();
}

function addCoins(amount) {
    APP_STATE.currentUser.coins += amount;
    updateUI();
    saveUserData();
}

function calculateXPForLevel(level) {
    return Math.floor(CONFIG.xp.baseXP * Math.pow(CONFIG.xp.levelMultiplier, level - 1));
}

function checkBadgeUnlocks() {
    const badges = getAllBadges();

    badges.forEach(badge => {
        if (!APP_STATE.currentUser.badges.includes(badge.id) && badge.condition()) {
            APP_STATE.currentUser.badges.push(badge.id);
            showNotification(`🏅 Badge débloqué: ${badge.name} !`);
        }
    });

    updateUI();
}

// ========================================
// DÉFIS
// ========================================

function generateInitialData() {
    // Générer les défis quotidiens
    APP_STATE.challenges.daily = [
        {
            id: 'daily1',
            icon: '🏃‍♂️',
            title: 'Coureur du matin',
            description: 'Courir 5 km avant midi',
            type: 'distance',
            target: 5,
            progress: 0,
            reward: { xp: 50, coins: 20 },
            completed: false
        },
        {
            id: 'daily2',
            icon: '🔥',
            title: 'Maintiens la série !',
            description: 'Courir pendant 30 minutes',
            type: 'time',
            target: 30,
            progress: 0,
            reward: { xp: 40, coins: 15 },
            completed: false
        },
        {
            id: 'daily3',
            icon: '⚡',
            title: 'Vitesse éclair',
            description: 'Courir 1 km à moins de 5 min/km',
            type: 'pace',
            target: 5,
            progress: 0,
            reward: { xp: 60, coins: 25 },
            completed: false
        }
    ];

    // Générer les défis hebdomadaires
    APP_STATE.challenges.weekly = [
        {
            id: 'weekly1',
            icon: '🎯',
            title: 'Marathon personnel',
            description: 'Courir 50 km cette semaine',
            type: 'distance',
            target: 50,
            progress: 12,
            reward: { xp: 200, coins: 100 },
            completed: false
        },
        {
            id: 'weekly2',
            icon: '👥',
            title: 'Social runner',
            description: 'Courir avec 5 personnes différentes',
            type: 'social',
            target: 5,
            progress: 2,
            reward: { xp: 150, coins: 75 },
            completed: false
        },
        {
            id: 'weekly3',
            icon: '🏆',
            title: 'Champion du leaderboard',
            description: 'Atteindre le top 10 local',
            type: 'ranking',
            target: 10,
            progress: 0,
            reward: { xp: 250, coins: 150 },
            completed: false
        }
    ];

    // Générer le leaderboard
    generateLeaderboard();

    // Générer des amis
    generateFriends();
}

function updateChallengesDisplay() {
    // Défis quotidiens (sidebar)
    const dailyChallengesEl = document.getElementById('dailyChallenges');
    dailyChallengesEl.innerHTML = APP_STATE.challenges.daily.slice(0, 3).map(challenge => `
        <div class="challenge-mini">
            ${challenge.icon} ${challenge.title}
        </div>
    `).join('');

    // Défis quotidiens (vue complète)
    const dailyChallengesListEl = document.getElementById('dailyChallengesList');
    dailyChallengesListEl.innerHTML = APP_STATE.challenges.daily.map(challenge => `
        <div class="challenge-card ${challenge.completed ? 'completed' : ''}" onclick="completeChallenge('${challenge.id}', 'daily')">
            <div class="challenge-header">
                <div class="challenge-icon">${challenge.icon}</div>
                <div class="challenge-reward">+${challenge.reward.xp} XP | +${challenge.reward.coins} 💰</div>
            </div>
            <div class="challenge-title">${challenge.title}</div>
            <div class="challenge-description">${challenge.description}</div>
            <div class="challenge-progress">
                <div class="challenge-progress-bar" style="width: ${(challenge.progress / challenge.target) * 100}%"></div>
            </div>
            <div class="challenge-progress-text">${challenge.progress} / ${challenge.target}</div>
            ${challenge.completed ? '<div class="challenge-completed-badge">✓ Complété</div>' : ''}
        </div>
    `).join('');

    // Défis hebdomadaires
    const weeklyChallengesListEl = document.getElementById('weeklyChallengesList');
    weeklyChallengesListEl.innerHTML = APP_STATE.challenges.weekly.map(challenge => `
        <div class="challenge-card ${challenge.completed ? 'completed' : ''}" onclick="completeChallenge('${challenge.id}', 'weekly')">
            <div class="challenge-header">
                <div class="challenge-icon">${challenge.icon}</div>
                <div class="challenge-reward">+${challenge.reward.xp} XP | +${challenge.reward.coins} 💰</div>
            </div>
            <div class="challenge-title">${challenge.title}</div>
            <div class="challenge-description">${challenge.description}</div>
            <div class="challenge-progress">
                <div class="challenge-progress-bar" style="width: ${(challenge.progress / challenge.target) * 100}%"></div>
            </div>
            <div class="challenge-progress-text">${challenge.progress} / ${challenge.target}</div>
            ${challenge.completed ? '<div class="challenge-completed-badge">✓ Complété</div>' : ''}
        </div>
    `).join('');
}

function completeChallenge(challengeId, type) {
    const challenges = type === 'daily' ? APP_STATE.challenges.daily : APP_STATE.challenges.weekly;
    const challenge = challenges.find(c => c.id === challengeId);

    if (challenge && !challenge.completed) {
        // Simuler la progression
        challenge.progress = Math.min(challenge.progress + (challenge.target / 3), challenge.target);

        if (challenge.progress >= challenge.target) {
            challenge.completed = true;
            addXP(challenge.reward.xp);
            addCoins(challenge.reward.coins);
            showNotification(`🎉 Défi complété: ${challenge.title} ! +${challenge.reward.xp} XP, +${challenge.reward.coins} coins`);
        } else {
            showNotification(`📈 Progression: ${challenge.progress}/${challenge.target}`);
        }

        updateChallengesDisplay();
        saveUserData();
    }
}

// ========================================
// LEADERBOARD
// ========================================

function generateLeaderboard() {
    const names = ['Alex', 'Sophie', 'Thomas', 'Marie', 'Lucas', 'Emma', 'Hugo', 'Léa', 'Arthur', 'Chloé', 'Nathan', 'Camille', 'Louis', 'Inès', 'Jules'];

    // Leaderboard mondial
    APP_STATE.leaderboard.global = names.map((name, index) => ({
        name,
        xp: 10000 - (index * 500) + Math.floor(Math.random() * 400),
        level: Math.max(1, 20 - index),
        totalRuns: 200 - (index * 10) + Math.floor(Math.random() * 20),
        totalDistance: 1000 - (index * 50) + Math.floor(Math.random() * 100)
    }));

    // Ajouter l'utilisateur actuel
    APP_STATE.leaderboard.global.push({
        name: APP_STATE.currentUser.name,
        xp: APP_STATE.currentUser.xp,
        level: APP_STATE.currentUser.level,
        totalRuns: APP_STATE.currentUser.totalRuns,
        totalDistance: APP_STATE.currentUser.totalDistance,
        isCurrentUser: true
    });

    // Trier par XP
    APP_STATE.leaderboard.global.sort((a, b) => b.xp - a.xp);

    // Leaderboard local (copie du global pour la démo)
    APP_STATE.leaderboard.local = [...APP_STATE.leaderboard.global];

    // Leaderboard amis
    APP_STATE.leaderboard.friends = APP_STATE.leaderboard.global.slice(0, 5);
}

function updateLeaderboardDisplay(type = 'global') {
    const leaderboardContentEl = document.getElementById('leaderboardContent');
    const data = APP_STATE.leaderboard[type];

    leaderboardContentEl.innerHTML = data.map((user, index) => {
        const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
        const rank = index + 1;

        return `
            <div class="leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}">
                <div class="leaderboard-rank ${rankClass}">#${rank}</div>
                <div class="leaderboard-avatar">🏃‍♂️</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${user.name} ${user.isCurrentUser ? '(Vous)' : ''}</div>
                    <div class="leaderboard-stats">${user.totalRuns} courses • ${user.totalDistance} km</div>
                </div>
                <div class="leaderboard-score">${user.xp} XP</div>
            </div>
        `;
    }).join('');
}

// ========================================
// AMIS
// ========================================

function generateFriends() {
    const names = ['Sophie', 'Thomas', 'Lucas', 'Emma', 'Hugo'];

    APP_STATE.currentUser.friends = names.map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name,
        online: Math.random() > 0.5,
        level: Math.floor(Math.random() * 20) + 1,
        lastRun: '2 heures'
    }));
}

function updateFriendsDisplay() {
    const friendsListEl = document.getElementById('friendsList');

    friendsListEl.innerHTML = APP_STATE.currentUser.friends.map(friend => `
        <div class="friend-card">
            <div class="friend-avatar">🏃‍♂️</div>
            <div class="friend-info">
                <div class="friend-name">${friend.name}</div>
                <div class="friend-status ${friend.online ? 'online' : ''}">${friend.online ? '🟢 En ligne' : `⚫ Dernière course: ${friend.lastRun}`}</div>
            </div>
            <div class="friend-actions">
                <button class="icon-btn" onclick="sendRunRequest('${friend.id}')">🏃‍♂️</button>
                <button class="icon-btn" onclick="openChat('${friend.id}')">💬</button>
            </div>
        </div>
    `).join('');
}

// ========================================
// BOUTIQUE
// ========================================

function getShopItems() {
    return [
        { id: 'avatar1', name: 'Avatar Premium', icon: '👑', price: 100, description: 'Personnalise ton avatar' },
        { id: 'badge1', name: 'Badge Éclair', icon: '⚡', price: 150, description: 'Badge exclusif' },
        { id: 'boost1', name: 'Boost XP x2', icon: '🚀', price: 200, description: 'Double XP pendant 24h' },
        { id: 'theme1', name: 'Thème Nuit', icon: '🌙', price: 250, description: 'Mode sombre élégant' },
        { id: 'trail1', name: 'Traînée Arc-en-ciel', icon: '🌈', price: 300, description: 'Effet visuel sur la carte' },
        { id: 'title1', name: 'Titre "Champion"', icon: '🏆', price: 500, description: 'Titre prestigieux' }
    ];
}

function updateShopDisplay() {
    const shopItemsEl = document.getElementById('shopItems');
    const shopCoinsEl = document.getElementById('shopCoins');

    shopCoinsEl.textContent = APP_STATE.currentUser.coins;

    const items = getShopItems();

    shopItemsEl.innerHTML = items.map(item => {
        const purchased = APP_STATE.currentUser.purchases.includes(item.id);

        return `
            <div class="shop-item ${purchased ? 'purchased' : ''}" onclick="${!purchased ? `purchaseItem('${item.id}', ${item.price})` : ''}">
                <div class="shop-item-icon">${item.icon}</div>
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-description">${item.description}</div>
                ${purchased ?
        '<div class="shop-item-price" style="background: var(--success);">✓ Acheté</div>' :
        `<div class="shop-item-price">💰 ${item.price}</div>`
}
            </div>
        `;
    }).join('');
}

function purchaseItem(itemId, price) {
    if (APP_STATE.currentUser.coins >= price) {
        APP_STATE.currentUser.coins -= price;
        APP_STATE.currentUser.purchases.push(itemId);

        const item = getShopItems().find(i => i.id === itemId);
        showNotification(`✅ ${item.name} acheté ! ${item.icon}`);

        updateShopDisplay();
        updateUI();
        saveUserData();
    } else {
        showNotification('❌ Pas assez de coins !');
    }
}

// ========================================
// BADGES
// ========================================

function getAllBadges() {
    return [
        { id: 'first_run', name: 'Première Course', icon: '🏃‍♂️', description: 'Complète ta première course', condition: () => APP_STATE.currentUser.totalRuns >= 1 },
        { id: 'level_5', name: 'Niveau 5', icon: '⭐', description: 'Atteins le niveau 5', condition: () => APP_STATE.currentUser.level >= 5 },
        { id: 'level_10', name: 'Niveau 10', icon: '🌟', description: 'Atteins le niveau 10', condition: () => APP_STATE.currentUser.level >= 10 },
        { id: 'streak_7', name: 'Série de 7', icon: '🔥', description: 'Cours 7 jours d\'affilée', condition: () => APP_STATE.currentUser.currentStreak >= 7 },
        { id: 'rich', name: 'Millionnaire', icon: '💰', description: 'Possède 1000 coins', condition: () => APP_STATE.currentUser.coins >= 1000 },
        { id: '100km', name: '100 km', icon: '📏', description: 'Cours 100 km au total', condition: () => APP_STATE.currentUser.totalDistance >= 100 },
        { id: 'social', name: 'Social', icon: '👥', description: 'Ajoute 5 amis', condition: () => APP_STATE.currentUser.friends.length >= 5 },
        { id: 'shopper', name: 'Shopper', icon: '🛒', description: 'Achète 5 articles', condition: () => APP_STATE.currentUser.purchases.length >= 5 }
    ];
}

function updateBadgesDisplay() {
    // Badges dans la sidebar
    const userBadgesEl = document.getElementById('userBadges');
    const unlockedBadges = getAllBadges().filter(b => APP_STATE.currentUser.badges.includes(b.id));

    userBadgesEl.innerHTML = unlockedBadges.slice(0, 6).map(badge => `
        <div class="badge-mini" title="${badge.name}">${badge.icon}</div>
    `).join('') || '<p style="font-size: 0.85rem; color: var(--gray);">Débloque des badges en jouant !</p>';

    // Tous les badges dans le profil
    const allBadgesEl = document.getElementById('allBadges');

    allBadgesEl.innerHTML = getAllBadges().map(badge => {
        const unlocked = APP_STATE.currentUser.badges.includes(badge.id);

        return `
            <div class="badge-item ${unlocked ? 'unlocked' : 'locked'}" title="${badge.description}">
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
            </div>
        `;
    }).join('');
}

// ========================================
// PROFIL
// ========================================

function updateProfileDisplay() {
    document.getElementById('profileName').textContent = APP_STATE.currentUser.name;
    document.getElementById('profileLevel').textContent = APP_STATE.currentUser.level;
    document.getElementById('profileCoins').textContent = APP_STATE.currentUser.coins;
    document.getElementById('profileXP').textContent = APP_STATE.currentUser.xp;

    document.getElementById('totalRuns').textContent = APP_STATE.currentUser.totalRuns;
    document.getElementById('totalDistance').textContent = APP_STATE.currentUser.totalDistance;
    document.getElementById('totalTime').textContent = APP_STATE.currentUser.totalTime;
    document.getElementById('currentStreak').textContent = APP_STATE.currentUser.currentStreak;
}

// ========================================
// CHAT
// ========================================

function openChat(friendId) {
    const chatPanel = document.getElementById('chatPanel');
    const chatMessages = document.getElementById('chatMessages');

    // Simuler des messages
    chatMessages.innerHTML = `
        <div class="chat-message received">
            <div class="chat-message-author">Sophie</div>
            <div class="chat-message-text">Salut ! Ça te dit une course ce soir ?</div>
            <div class="chat-message-time">Il y a 5 min</div>
        </div>
        <div class="chat-message sent">
            <div class="chat-message-author">Vous</div>
            <div class="chat-message-text">Oui, avec plaisir ! Vers 18h ?</div>
            <div class="chat-message-time">Il y a 2 min</div>
        </div>
    `;

    chatPanel.style.display = 'flex';
    showNotification('💬 Chat ouvert');
}

function sendRunRequest(friendId) {
    showNotification('🏃‍♂️ Demande de course envoyée !');
}

// ========================================
// ÉVÉNEMENTS
// ========================================

function initEventListeners() {
    // Navigation sidebar
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.currentTarget.dataset.view;
            switchView(view);
        });
    });

    // Bouton localisation
    document.getElementById('locateMe').addEventListener('click', () => {
        getUserLocation();
        showNotification('📍 Recherche de votre position...');
    });

    // Bouton filtres
    document.getElementById('toggleFilters').addEventListener('click', () => {
        const filtersPanel = document.getElementById('filtersPanel');
        filtersPanel.classList.toggle('active');
    });

    // Filtre distance
    document.getElementById('distanceFilter').addEventListener('input', (e) => {
        document.getElementById('distanceValue').textContent = `${e.target.value  } km`;
    });

    // Nouveaux contrôles de carte
    document.getElementById('toggleMapStyle')?.addEventListener('click', () => {
        const styleSelector = document.getElementById('mapStyleSelector');
        styleSelector.style.display = styleSelector.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('measureDistance')?.addEventListener('click', () => {
        addDistanceCircles();
    });

    document.getElementById('showRoutes')?.addEventListener('click', () => {
        showSuggestedRoutes();
    });

    document.getElementById('toggleHeatmap')?.addEventListener('click', (e) => {
        document.body.classList.toggle('heatmap-active');
        e.currentTarget.classList.toggle('active');
        const isActive = document.body.classList.contains('heatmap-active');
        showNotification(isActive ? '🔥 Heatmap activée' : '🔥 Heatmap désactivée');
    });

    document.getElementById('fullscreenMap')?.addEventListener('click', () => {
        toggleFullscreen();
    });

    // Planificateur d'itinéraire
    document.getElementById('planRouteBtn')?.addEventListener('click', () => {
        openRoutePlanner();
    });

    // Tabs leaderboard
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            updateLeaderboardDisplay(e.currentTarget.dataset.tab);
        });
    });

    // Modal
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        });
    });

    // Boutons modal coureur
    document.getElementById('sendRunRequestBtn').addEventListener('click', () => {
        if (APP_STATE.selectedRunner) {
            showNotification(`🏃‍♂️ Demande de course envoyée à ${APP_STATE.selectedRunner.name} !`);
            document.getElementById('runnerModal').classList.remove('active');

            // Ajouter de l'XP pour l'interaction sociale
            addXP(10);
        }
    });

    document.getElementById('chatRunnerBtn').addEventListener('click', () => {
        if (APP_STATE.selectedRunner) {
            openChat(APP_STATE.selectedRunner.id);
            document.getElementById('runnerModal').classList.remove('active');
        }
    });

    // Chat
    document.getElementById('closeChatBtn').addEventListener('click', () => {
        document.getElementById('chatPanel').style.display = 'none';
    });

    document.getElementById('sendMessageBtn').addEventListener('click', sendChatMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });

    // Bouton ajouter ami
    document.getElementById('addFriendBtn').addEventListener('click', () => {
        showNotification('➕ Fonctionnalité bientôt disponible !');
    });
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message sent';
        messageEl.innerHTML = `
            <div class="chat-message-author">Vous</div>
            <div class="chat-message-text">${message}</div>
            <div class="chat-message-time">À l'instant</div>
        `;
        chatMessages.appendChild(messageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        input.value = '';

        // Ajouter de l'XP pour l'interaction sociale
        addXP(5);
    }
}

function switchView(viewName) {
    // Désactiver toutes les vues
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));

    // Activer la vue sélectionnée
    document.getElementById(`${viewName  }View`).classList.add('active');
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

    // Mettre à jour l'affichage selon la vue
    switch (viewName) {
    case 'challenges':
        updateChallengesDisplay();
        break;
    case 'minigames':
        updateGameStatsDisplay();
        break;
    case 'leaderboard':
        updateLeaderboardDisplay('global');
        break;
    case 'friends':
        updateFriendsDisplay();
        break;
    case 'shop':
        updateShopDisplay();
        break;
    case 'profile':
        updateProfileDisplay();
        updateBadgesDisplay();
        break;
    }
}

// ========================================
// NOTIFICATIONS
// ========================================

function showNotification(message) {
    const toast = document.getElementById('notificationToast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========================================
// MISE À JOUR UI
// ========================================

function updateUI() {
    // Navbar
    document.getElementById('userCoins').textContent = APP_STATE.currentUser.coins;
    document.getElementById('userLevel').textContent = APP_STATE.currentUser.level;
    document.getElementById('userXP').textContent = APP_STATE.currentUser.xp;

    const xpMax = calculateXPForLevel(APP_STATE.currentUser.level);
    document.getElementById('userXPMax').textContent = xpMax;

    const xpPercent = (APP_STATE.currentUser.xp / xpMax) * 100;
    document.getElementById('xpProgress').style.width = `${xpPercent  }%`;

    // Mettre à jour les affichages
    updateChallengesDisplay();
    updateBadgesDisplay();
    updateShopDisplay();
}

// ========================================
// SAUVEGARDE/CHARGEMENT
// ========================================

function saveUserData() {
    try {
        localStorage.setItem('paceMateUser', JSON.stringify(APP_STATE.currentUser));
    } catch (e) {
        console.error('Erreur de sauvegarde:', e);
    }
}

function loadUserData() {
    try {
        const saved = localStorage.getItem('paceMateUser');
        if (saved) {
            const data = JSON.parse(saved);
            APP_STATE.currentUser = { ...APP_STATE.currentUser, ...data };
        } else {
            // Données initiales pour la démo
            APP_STATE.currentUser.coins = 150;
            APP_STATE.currentUser.xp = 25;
            APP_STATE.currentUser.totalRuns = 5;
            APP_STATE.currentUser.totalDistance = 23;
            APP_STATE.currentUser.totalTime = 2;
            APP_STATE.currentUser.currentStreak = 3;
        }
    } catch (e) {
        console.error('Erreur de chargement:', e);
    }
}

// ========================================
// MISES À JOUR PÉRIODIQUES
// ========================================

function startPeriodicUpdates() {
    // Mettre à jour les coureurs à proximité toutes les 30 secondes
    setInterval(() => {
        if (APP_STATE.currentLocation) {
            // Simuler le mouvement des coureurs
            APP_STATE.nearbyRunners.forEach(runner => {
                runner.distance = (parseFloat(runner.distance) + (Math.random() - 0.5) * 0.5).toFixed(1);
            });
            updateRunnersList();
        }
    }, 30000);

    // Simuler des gains d'XP aléatoires (courses en arrière-plan)
    setInterval(() => {
        if (Math.random() > 0.8) {
            const xpGain = Math.floor(Math.random() * 20) + 5;
            addXP(xpGain);
            showNotification(`🎉 Course simulée ! +${xpGain} XP`);
        }
    }, 60000);
}

// ========================================
// MINI-JEUX SYSTÈME
// ========================================

// État des mini-jeux
const GAME_STATE = {
    currentGame: null,
    gameMap: null,
    gameTimer: null,
    gameTimeLeft: 0,
    territories: [],
    teams: {
        red: { players: [], territories: 0, color: '#FF6B6B' },
        blue: { players: [], territories: 0, color: '#4ECDC4' }
    },
    currentTeam: null,
    checkpoints: [],
    treasures: [],
    gameStats: {
        totalWins: 0,
        totalGames: 0,
        gameHistory: {}
    }
};

// Initialiser les stats de jeu depuis localStorage
function loadGameStats() {
    const saved = localStorage.getItem('paceMateGameStats');
    if (saved) {
        GAME_STATE.gameStats = JSON.parse(saved);
    }
    updateGameStatsDisplay();
}

function saveGameStats() {
    localStorage.setItem('paceMateGameStats', JSON.stringify(GAME_STATE.gameStats));
}

// Démarrer un mini-jeu
function startGame(gameType) {
    GAME_STATE.currentGame = gameType;

    // Afficher la section de jeu actif
    document.getElementById('activeGameSection').style.display = 'block';

    // Scroll vers la section
    document.getElementById('activeGameSection').scrollIntoView({ behavior: 'smooth' });

    switch (gameType) {
    case 'territory':
        startTerritoryGame();
        break;
    case 'checkpoint':
        startCheckpointGame();
        break;
    case 'kinghill':
        startKingHillGame();
        break;
    case 'treasure':
        startTreasureHuntGame();
        break;
    case 'relay':
        startRelayGame();
        break;
    case 'defense':
        startDefenseGame();
        break;
    }

    showNotification(`🎮 ${getGameName(gameType)} commencé ! Bonne chance !`);
}

function getGameName(gameType) {
    const names = {
        territory: 'Capture de Zones',
        checkpoint: 'Course aux Checkpoints',
        kinghill: 'Roi de la Colline',
        treasure: 'Chasse au Trésor',
        relay: 'Relais par Équipe',
        defense: 'Défense de Zone'
    };
    return names[gameType] || 'Mini-Jeu';
}

// ========================================
// JEU 1: CAPTURE DE ZONES (TERRITOIRES)
// ========================================

function startTerritoryGame() {
    document.getElementById('activeGameTitle').textContent = '🗺️ Capture de Zones';
    document.getElementById('territoryGameInterface').style.display = 'block';
    document.getElementById('genericGameInterface').style.display = 'none';

    // Initialiser la carte du jeu
    if (GAME_STATE.gameMap) {
        GAME_STATE.gameMap.remove();
    }

    GAME_STATE.gameMap = L.map('territoryMap').setView(APP_STATE.currentLocation || CONFIG.map.defaultCenter, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(GAME_STATE.gameMap);

    // Générer les zones de territoire
    generateTerritories();

    // Assigner l'utilisateur à une équipe aléatoire
    GAME_STATE.currentTeam = Math.random() > 0.5 ? 'red' : 'blue';

    // Générer des joueurs dans les équipes
    generateTeamPlayers();

    // Démarrer le timer (15 minutes)
    startGameTimer(15 * 60);

    // Mettre à jour l'affichage
    updateTerritoryDisplay();
}

function generateTerritories() {
    GAME_STATE.territories = [];
    const center = APP_STATE.currentLocation || CONFIG.map.defaultCenter;

    // Créer une grille de 25 zones (5x5)
    const gridSize = 5;
    const spacing = 0.01; // ~1km

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const lat = center[0] + (i - 2) * spacing;
            const lng = center[1] + (j - 2) * spacing;

            const territory = {
                id: `zone-${i}-${j}`,
                position: [lat, lng],
                owner: 'neutral',
                captureProgress: 0
            };

            GAME_STATE.territories.push(territory);

            // Créer un marqueur sur la carte
            const marker = L.circleMarker([lat, lng], {
                radius: 30,
                fillColor: '#CCCCCC',
                color: '#FFFFFF',
                weight: 2,
                fillOpacity: 0.6
            }).addTo(GAME_STATE.gameMap);

            marker.on('click', () => attemptCapture(territory));
            territory.marker = marker;

            // Popup
            marker.bindPopup(`<b>Zone ${i}-${j}</b><br>⚪ Neutre`);
        }
    }

    // Quelques zones déjà capturées pour commencer
    for (let i = 0; i < 8; i++) {
        const randomTerritory = GAME_STATE.territories[Math.floor(Math.random() * GAME_STATE.territories.length)];
        const randomTeam = Math.random() > 0.5 ? 'red' : 'blue';
        randomTerritory.owner = randomTeam;
        randomTerritory.captureProgress = 100;
        updateTerritoryMarker(randomTerritory);
    }
}

function generateTeamPlayers() {
    const names = ['Alex', 'Sophie', 'Thomas', 'Marie', 'Lucas', 'Emma', 'Hugo', 'Léa'];

    // Équipe rouge (4 joueurs)
    GAME_STATE.teams.red.players = [];
    for (let i = 0; i < 4; i++) {
        GAME_STATE.teams.red.players.push({
            name: names[Math.floor(Math.random() * names.length)],
            score: 0
        });
    }

    // Équipe bleue (4 joueurs)
    GAME_STATE.teams.blue.players = [];
    for (let i = 0; i < 4; i++) {
        GAME_STATE.teams.blue.players.push({
            name: names[Math.floor(Math.random() * names.length)],
            score: 0
        });
    }

    // Ajouter l'utilisateur
    const userTeam = GAME_STATE.currentTeam;
    GAME_STATE.teams[userTeam].players.push({
        name: `${APP_STATE.currentUser.name  } (Vous)`,
        score: 0,
        isUser: true
    });
}

function attemptCapture(territory) {
    if (!GAME_STATE.currentTeam) {
        return;
    }

    const userTeam = GAME_STATE.currentTeam;

    // Si la zone est déjà capturée par notre équipe
    if (territory.owner === userTeam) {
        showNotification('✅ Cette zone est déjà à votre équipe !');
        return;
    }

    // Capturer la zone
    territory.owner = userTeam;
    territory.captureProgress = 100;
    updateTerritoryMarker(territory);
    updateTerritoryDisplay();

    // Récompenses
    addXP(20);
    addCoins(10);

    showNotification(`📍 Zone capturée pour l'équipe ${userTeam === 'red' ? '🔴 Rouge' : '🔵 Bleue'} ! +20 XP`);
}

function captureZone() {
    // Trouver la zone la plus proche de l'utilisateur
    const center = GAME_STATE.gameMap.getCenter();
    let closestTerritory = null;
    let minDistance = Infinity;

    GAME_STATE.territories.forEach(territory => {
        const distance = Math.sqrt(
            Math.pow(territory.position[0] - center.lat, 2) +
            Math.pow(territory.position[1] - center.lng, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            closestTerritory = territory;
        }
    });

    if (closestTerritory) {
        attemptCapture(closestTerritory);
        GAME_STATE.gameMap.panTo(closestTerritory.position);
    }
}

function updateTerritoryMarker(territory) {
    const colors = {
        neutral: '#CCCCCC',
        red: '#FF6B6B',
        blue: '#4ECDC4'
    };

    const icons = {
        neutral: '⚪',
        red: '🔴',
        blue: '🔵'
    };

    territory.marker.setStyle({
        fillColor: colors[territory.owner],
        fillOpacity: 0.7
    });

    territory.marker.setPopupContent(`<b>Zone</b><br>${icons[territory.owner]} ${territory.owner === 'neutral' ? 'Neutre' : territory.owner === 'red' ? 'Équipe Rouge' : 'Équipe Bleue'}`);
}

function updateTerritoryDisplay() {
    // Compter les territoires par équipe
    let redCount = 0;
    let blueCount = 0;
    let neutralCount = 0;

    GAME_STATE.territories.forEach(t => {
        if (t.owner === 'red') {
            redCount++;
        } else if (t.owner === 'blue') {
            blueCount++;
        } else {
            neutralCount++;
        }
    });

    document.getElementById('redTerritory').textContent = redCount;
    document.getElementById('blueTerritory').textContent = blueCount;
    document.getElementById('neutralTerritory').textContent = neutralCount;

    // Afficher les joueurs
    document.getElementById('redPlayers').innerHTML =
        GAME_STATE.teams.red.players.map(p => `<div>${p.name}</div>`).join('');
    document.getElementById('bluePlayers').innerHTML =
        GAME_STATE.teams.blue.players.map(p => `<div>${p.name}</div>`).join('');

    GAME_STATE.teams.red.territories = redCount;
    GAME_STATE.teams.blue.territories = blueCount;
}

function switchTeam() {
    GAME_STATE.currentTeam = GAME_STATE.currentTeam === 'red' ? 'blue' : 'red';
    showNotification(`🔄 Vous êtes maintenant dans l'équipe ${GAME_STATE.currentTeam === 'red' ? '🔴 Rouge' : '🔵 Bleue'}`);
}

// ========================================
// JEU 2: COURSE AUX CHECKPOINTS
// ========================================

function startCheckpointGame() {
    document.getElementById('activeGameTitle').textContent = '📍 Course aux Checkpoints';
    document.getElementById('territoryGameInterface').style.display = 'none';
    document.getElementById('genericGameInterface').style.display = 'block';

    // Initialiser la carte
    if (GAME_STATE.gameMap) {
        GAME_STATE.gameMap.remove();
    }

    GAME_STATE.gameMap = L.map('genericGameMap').setView(APP_STATE.currentLocation || CONFIG.map.defaultCenter, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(GAME_STATE.gameMap);

    // Générer 10 checkpoints
    generateCheckpoints(10);

    startGameTimer(20 * 60); // 20 minutes

    document.getElementById('gameObjective').innerHTML = `
        <h3>🎯 Objectif</h3>
        <p>Atteins tous les checkpoints dans l'ordre le plus rapidement possible !</p>
        <p><strong>Checkpoints restants: <span id="checkpointsLeft">10</span>/10</strong></p>
    `;

    createGenericLeaderboard();
}

function generateCheckpoints(count) {
    GAME_STATE.checkpoints = [];
    const center = APP_STATE.currentLocation || CONFIG.map.defaultCenter;

    for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI;
        const distance = 0.015 + Math.random() * 0.01;

        const lat = center[0] + distance * Math.cos(angle);
        const lng = center[1] + distance * Math.sin(angle);

        const checkpoint = {
            id: i + 1,
            position: [lat, lng],
            completed: false
        };

        GAME_STATE.checkpoints.push(checkpoint);

        // Marqueur
        const marker = L.marker([lat, lng], {
            icon: L.divIcon({
                html: `<div class="checkpoint-marker">${i + 1}</div>`,
                className: '',
                iconSize: [50, 50]
            })
        }).addTo(GAME_STATE.gameMap);

        marker.on('click', () => reachCheckpoint(checkpoint));
        checkpoint.marker = marker;

        marker.bindPopup(`<b>Checkpoint ${i + 1}</b><br>Clique pour valider !`);
    }
}

function reachCheckpoint(checkpoint) {
    if (checkpoint.completed) {
        showNotification('✅ Checkpoint déjà validé !');
        return;
    }

    checkpoint.completed = true;
    checkpoint.marker.setIcon(L.divIcon({
        html: '<div class="checkpoint-marker completed">✓</div>',
        className: '',
        iconSize: [50, 50]
    }));

    const remaining = GAME_STATE.checkpoints.filter(c => !c.completed).length;
    document.getElementById('checkpointsLeft').textContent = remaining;

    addXP(30);
    addCoins(15);

    if (remaining === 0) {
        endGame(true, 'checkpoint');
    } else {
        showNotification(`✅ Checkpoint ${checkpoint.id} validé ! +30 XP`);
    }
}

// ========================================
// JEU 3: ROI DE LA COLLINE
// ========================================

function startKingHillGame() {
    document.getElementById('activeGameTitle').textContent = '⛰️ Roi de la Colline';
    document.getElementById('territoryGameInterface').style.display = 'none';
    document.getElementById('genericGameInterface').style.display = 'block';

    if (GAME_STATE.gameMap) {
        GAME_STATE.gameMap.remove();
    }

    GAME_STATE.gameMap = L.map('genericGameMap').setView(APP_STATE.currentLocation || CONFIG.map.defaultCenter, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(GAME_STATE.gameMap);

    // Zone centrale à contrôler
    const center = APP_STATE.currentLocation || CONFIG.map.defaultCenter;
    const hillZone = L.circle(center, {
        radius: 200,
        fillColor: '#FFD700',
        color: '#FFA500',
        weight: 3,
        fillOpacity: 0.5
    }).addTo(GAME_STATE.gameMap);

    startGameTimer(15 * 60); // 15 minutes

    document.getElementById('gameObjective').innerHTML = `
        <h3>👑 Objectif</h3>
        <p>Reste dans la zone dorée le plus longtemps possible !</p>
        <p><strong>Temps contrôlé: <span id="hillTime">0</span> secondes</strong></p>
        <button class="btn btn-primary" onclick="claimHill()">👑 Je suis dans la zone !</button>
    `;

    GAME_STATE.hillTime = 0;
    GAME_STATE.hillInterval = setInterval(() => {
        GAME_STATE.hillTime++;
        document.getElementById('hillTime').textContent = GAME_STATE.hillTime;

        if (GAME_STATE.hillTime % 10 === 0) {
            addXP(10);
            addCoins(5);
        }
    }, 1000);

    createGenericLeaderboard();
}

function claimHill() {
    showNotification('👑 Tu contrôles la colline ! Continue de courir !');
    addXP(50);
    addCoins(25);
}

// ========================================
// JEU 4: CHASSE AU TRÉSOR
// ========================================

function startTreasureHuntGame() {
    document.getElementById('activeGameTitle').textContent = '💎 Chasse au Trésor';
    document.getElementById('territoryGameInterface').style.display = 'none';
    document.getElementById('genericGameInterface').style.display = 'block';

    if (GAME_STATE.gameMap) {
        GAME_STATE.gameMap.remove();
    }

    GAME_STATE.gameMap = L.map('genericGameMap').setView(APP_STATE.currentLocation || CONFIG.map.defaultCenter, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(GAME_STATE.gameMap);

    // Générer des trésors
    generateTreasures(15);

    startGameTimer(30 * 60); // 30 minutes

    document.getElementById('gameObjective').innerHTML = `
        <h3>💎 Objectif</h3>
        <p>Trouve et collecte les trésors cachés sur la carte !</p>
        <p><strong>Trésors trouvés: <span id="treasuresFound">0</span>/15</strong></p>
        <p><strong>Valeur totale: <span id="treasureValue">0</span> coins</strong></p>
    `;

    GAME_STATE.treasuresFound = 0;
    GAME_STATE.treasureValue = 0;

    createGenericLeaderboard();
}

function generateTreasures(count) {
    GAME_STATE.treasures = [];
    const center = APP_STATE.currentLocation || CONFIG.map.defaultCenter;

    for (let i = 0; i < count; i++) {
        const lat = center[0] + (Math.random() - 0.5) * 0.03;
        const lng = center[1] + (Math.random() - 0.5) * 0.03;

        const value = [50, 100, 200, 500][Math.floor(Math.random() * 4)];

        const treasure = {
            id: i + 1,
            position: [lat, lng],
            value: value,
            found: false
        };

        GAME_STATE.treasures.push(treasure);

        const marker = L.marker([lat, lng], {
            icon: L.divIcon({
                html: '<div class="treasure-marker">💎</div>',
                className: '',
                iconSize: [55, 55]
            })
        }).addTo(GAME_STATE.gameMap);

        marker.on('click', () => collectTreasure(treasure));
        treasure.marker = marker;

        marker.bindPopup(`<b>Trésor</b><br>💰 ${value} coins`);
    }
}

function collectTreasure(treasure) {
    if (treasure.found) {
        showNotification('✅ Trésor déjà collecté !');
        return;
    }

    treasure.found = true;
    treasure.marker.remove();

    GAME_STATE.treasuresFound++;
    GAME_STATE.treasureValue += treasure.value;

    document.getElementById('treasuresFound').textContent = GAME_STATE.treasuresFound;
    document.getElementById('treasureValue').textContent = GAME_STATE.treasureValue;

    addXP(60);
    addCoins(treasure.value);

    if (GAME_STATE.treasuresFound === GAME_STATE.treasures.length) {
        endGame(true, 'treasure');
    } else {
        showNotification(`💎 Trésor trouvé ! +${treasure.value} coins, +60 XP`);
    }
}

// ========================================
// JEU 5: RELAIS PAR ÉQUIPE
// ========================================

function startRelayGame() {
    document.getElementById('activeGameTitle').textContent = '🏃‍♂️ Relais par Équipe';
    document.getElementById('territoryGameInterface').style.display = 'none';
    document.getElementById('genericGameInterface').style.display = 'block';

    if (GAME_STATE.gameMap) {
        GAME_STATE.gameMap.remove();
    }

    GAME_STATE.gameMap = L.map('genericGameMap').setView(APP_STATE.currentLocation || CONFIG.map.defaultCenter, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(GAME_STATE.gameMap);

    startGameTimer(25 * 60); // 25 minutes

    document.getElementById('gameObjective').innerHTML = `
        <h3>🏃‍♂️ Objectif</h3>
        <p>Cours en relais avec ton équipe ! Passe le témoin au bon moment.</p>
        <p><strong>Tours complétés: <span id="lapsCompleted">0</span>/4</strong></p>
        <button class="btn btn-primary" onclick="passRelay()">🔄 Passer le témoin</button>
    `;

    GAME_STATE.lapsCompleted = 0;

    createGenericLeaderboard();
}

function passRelay() {
    GAME_STATE.lapsCompleted++;
    document.getElementById('lapsCompleted').textContent = GAME_STATE.lapsCompleted;

    addXP(100);
    addCoins(50);

    if (GAME_STATE.lapsCompleted >= 4) {
        endGame(true, 'relay');
    } else {
        showNotification(`🔄 Témoin passé ! Tour ${GAME_STATE.lapsCompleted}/4 complété ! +100 XP`);
    }
}

// ========================================
// JEU 6: DÉFENSE DE ZONE
// ========================================

function startDefenseGame() {
    document.getElementById('activeGameTitle').textContent = '🛡️ Défense de Zone';
    document.getElementById('territoryGameInterface').style.display = 'none';
    document.getElementById('genericGameInterface').style.display = 'block';

    if (GAME_STATE.gameMap) {
        GAME_STATE.gameMap.remove();
    }

    GAME_STATE.gameMap = L.map('genericGameMap').setView(APP_STATE.currentLocation || CONFIG.map.defaultCenter, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(GAME_STATE.gameMap);

    const center = APP_STATE.currentLocation || CONFIG.map.defaultCenter;
    L.circle(center, {
        radius: 300,
        fillColor: '#06D6A0',
        color: '#05b08a',
        weight: 3,
        fillOpacity: 0.5
    }).addTo(GAME_STATE.gameMap);

    startGameTimer(10 * 60); // 10 minutes

    document.getElementById('gameObjective').innerHTML = `
        <h3>🛡️ Objectif</h3>
        <p>Défends ta zone contre les envahisseurs !</p>
        <p><strong>Envahisseurs repoussés: <span id="invadersDefeated">0</span></strong></p>
        <p><strong>Zone intacte: <span id="zoneHealth">100</span>%</strong></p>
        <button class="btn btn-primary" onclick="defendZone()">⚔️ Défendre !</button>
    `;

    GAME_STATE.invadersDefeated = 0;
    GAME_STATE.zoneHealth = 100;

    createGenericLeaderboard();
}

function defendZone() {
    GAME_STATE.invadersDefeated++;
    document.getElementById('invadersDefeated').textContent = GAME_STATE.invadersDefeated;

    addXP(35);
    addCoins(20);

    showNotification('⚔️ Envahisseur repoussé ! +35 XP');

    if (GAME_STATE.invadersDefeated >= 20) {
        endGame(true, 'defense');
    }
}

// ========================================
// FONCTIONS COMMUNES DES MINI-JEUX
// ========================================

function startGameTimer(seconds) {
    GAME_STATE.gameTimeLeft = seconds;
    updateTimerDisplay();

    if (GAME_STATE.gameTimer) {
        clearInterval(GAME_STATE.gameTimer);
    }

    GAME_STATE.gameTimer = setInterval(() => {
        GAME_STATE.gameTimeLeft--;
        updateTimerDisplay();

        if (GAME_STATE.gameTimeLeft <= 0) {
            endGame(false, GAME_STATE.currentGame);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(GAME_STATE.gameTimeLeft / 60);
    const seconds = GAME_STATE.gameTimeLeft % 60;
    document.getElementById('gameTimer').textContent =
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function createGenericLeaderboard() {
    const names = ['Alex', 'Sophie', 'Thomas', 'Marie', 'Lucas', 'Emma'];
    const leaderboard = names.map((name, i) => ({
        name,
        score: Math.floor(Math.random() * 500) + 200
    }));

    leaderboard.push({
        name: `${APP_STATE.currentUser.name  } (Vous)`,
        score: 0,
        isUser: true
    });

    leaderboard.sort((a, b) => b.score - a.score);

    document.getElementById('gameLeaderboard').innerHTML = `
        <h4>🏆 Classement en Direct</h4>
        ${leaderboard.map((player, i) => `
            <div class="game-leaderboard-item" style="${player.isUser ? 'background: var(--accent);' : ''}">
                <div class="game-leaderboard-rank">#${i + 1}</div>
                <div class="game-leaderboard-name">${player.name}</div>
                <div class="game-leaderboard-score">${player.score}</div>
            </div>
        `).join('')}
    `;
}

function endGame(won, gameType) {
    if (GAME_STATE.gameTimer) {
        clearInterval(GAME_STATE.gameTimer);
    }

    if (GAME_STATE.hillInterval) {
        clearInterval(GAME_STATE.hillInterval);
    }

    // Stats
    GAME_STATE.gameStats.totalGames++;
    if (won) {
        GAME_STATE.gameStats.totalWins++;
    }

    if (!GAME_STATE.gameStats.gameHistory[gameType]) {
        GAME_STATE.gameStats.gameHistory[gameType] = { wins: 0, games: 0 };
    }
    GAME_STATE.gameStats.gameHistory[gameType].games++;
    if (won) {
        GAME_STATE.gameStats.gameHistory[gameType].wins++;
    }

    saveGameStats();
    updateGameStatsDisplay();

    // Récompenses finales
    if (won) {
        const rewards = {
            territory: { xp: 500, coins: 200 },
            checkpoint: { xp: 300, coins: 150 },
            kinghill: { xp: 400, coins: 180 },
            treasure: { xp: 600, coins: 250 },
            relay: { xp: 450, coins: 200 },
            defense: { xp: 350, coins: 160 }
        };

        const reward = rewards[gameType];
        addXP(reward.xp);
        addCoins(reward.coins);

        showNotification(`🎉 VICTOIRE ! +${reward.xp} XP, +${reward.coins} coins !`);
    } else {
        showNotification('⏰ Temps écoulé ! Réessaye pour gagner plus de récompenses !');
    }

    setTimeout(() => {
        quitGame();
    }, 3000);
}

function quitGame() {
    if (GAME_STATE.gameTimer) {
        clearInterval(GAME_STATE.gameTimer);
    }

    if (GAME_STATE.hillInterval) {
        clearInterval(GAME_STATE.hillInterval);
    }

    if (GAME_STATE.gameMap) {
        GAME_STATE.gameMap.remove();
        GAME_STATE.gameMap = null;
    }

    document.getElementById('activeGameSection').style.display = 'none';
    GAME_STATE.currentGame = null;

    showNotification('👋 Partie terminée !');
}

function updateGameStatsDisplay() {
    document.getElementById('gameCoins').textContent = APP_STATE.currentUser.coins;
    document.getElementById('gameWins').textContent = GAME_STATE.gameStats.totalWins;

    document.getElementById('totalWins').textContent = GAME_STATE.gameStats.totalWins;
    document.getElementById('totalGames').textContent = GAME_STATE.gameStats.totalGames;

    const winRate = GAME_STATE.gameStats.totalGames > 0
        ? ((GAME_STATE.gameStats.totalWins / GAME_STATE.gameStats.totalGames) * 100).toFixed(0)
        : 0;
    document.getElementById('winRate').textContent = `${winRate  }%`;

    // Jeu favori
    let favoriteGame = '-';
    let maxGames = 0;
    for (const [game, stats] of Object.entries(GAME_STATE.gameStats.gameHistory)) {
        if (stats.games > maxGames) {
            maxGames = stats.games;
            favoriteGame = getGameName(game);
        }
    }
    document.getElementById('favoriteGame').textContent = favoriteGame;
}

// ========================================
// HELPERS
// ========================================

// ========================================
// PLANIFICATEUR D'ITINÉRAIRE
// ========================================

function openRoutePlanner() {
    const panel = document.getElementById('routePlanningPanel');
    panel.style.display = 'block';
    ROUTE_PLANNER.isActive = true;

    // Définir le point de départ comme position actuelle
    if (APP_STATE.currentLocation) {
        ROUTE_PLANNER.startPoint = APP_STATE.currentLocation;
        document.getElementById('startPoint').value = '📍 Ma position actuelle';
        document.getElementById('startPoint').classList.add('selected');

        // Ajouter un marqueur de départ
        addRouteMarker(APP_STATE.currentLocation, 'start');
    }

    // Charger les itinéraires sauvegardés
    loadSavedRoutes();

    showNotification('🧭 Sélectionnez votre destination sur la carte');
}

function closeRoutePlanner() {
    const panel = document.getElementById('routePlanningPanel');
    panel.style.display = 'none';
    ROUTE_PLANNER.isActive = false;
    ROUTE_PLANNER.selectingStart = false;
    ROUTE_PLANNER.selectingEnd = false;
    ROUTE_PLANNER.selectingWaypoint = false;

    // Nettoyer les boutons actifs
    document.querySelectorAll('.step-btn').forEach(btn => btn.classList.remove('active'));
}

function selectStartPoint() {
    ROUTE_PLANNER.selectingStart = true;
    ROUTE_PLANNER.selectingEnd = false;
    ROUTE_PLANNER.selectingWaypoint = false;

    // Activer visuellement le bouton
    document.querySelectorAll('.step-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    showNotification('📍 Cliquez sur la carte pour choisir le point de départ');

    // Écouter le prochain clic sur la carte
    APP_STATE.map.once('click', (e) => {
        ROUTE_PLANNER.startPoint = [e.latlng.lat, e.latlng.lng];
        document.getElementById('startPoint').value = `📍 ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
        document.getElementById('startPoint').classList.add('selected');
        ROUTE_PLANNER.selectingStart = false;
        event.target.classList.remove('active');

        // Nettoyer et ajouter le nouveau marqueur
        removeRouteMarkers('start');
        addRouteMarker([e.latlng.lat, e.latlng.lng], 'start');

        showNotification('✅ Point de départ défini');
    });
}

function selectEndPoint() {
    ROUTE_PLANNER.selectingEnd = true;
    ROUTE_PLANNER.selectingStart = false;
    ROUTE_PLANNER.selectingWaypoint = false;

    // Activer visuellement le bouton
    document.querySelectorAll('.step-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    showNotification('📍 Cliquez sur la carte pour choisir le point d\'arrivée');

    // Écouter le prochain clic sur la carte
    APP_STATE.map.once('click', (e) => {
        ROUTE_PLANNER.endPoint = [e.latlng.lat, e.latlng.lng];
        document.getElementById('endPoint').value = `📍 ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
        document.getElementById('endPoint').classList.add('selected');
        ROUTE_PLANNER.selectingEnd = false;
        event.target.classList.remove('active');

        // Nettoyer et ajouter le nouveau marqueur
        removeRouteMarkers('end');
        addRouteMarker([e.latlng.lat, e.latlng.lng], 'end');

        showNotification('✅ Point d\'arrivée défini - Prêt à calculer l\'itinéraire !');
    });
}

function addWaypoint() {
    const waypointIndex = ROUTE_PLANNER.waypoints.length;
    const container = document.getElementById('waypointsContainer');

    const waypointDiv = document.createElement('div');
    waypointDiv.className = 'waypoint-step';
    waypointDiv.id = `waypoint-${waypointIndex}`;
    waypointDiv.innerHTML = `
        <div class="step-icon">${waypointIndex + 1}</div>
        <div class="step-content">
            <label>Étape intermédiaire ${waypointIndex + 1}</label>
            <input type="text" id="waypoint-input-${waypointIndex}" placeholder="Cliquez sur 'Choisir sur la carte'" readonly>
            <button class="step-btn" onclick="selectWaypoint(${waypointIndex})">📍 Choisir sur la carte</button>
        </div>
        <button class="remove-waypoint-btn" onclick="removeWaypoint(${waypointIndex})">🗑️</button>
    `;

    container.appendChild(waypointDiv);
    ROUTE_PLANNER.waypoints.push(null);

    showNotification('➕ Étape intermédiaire ajoutée');
}

function selectWaypoint(index) {
    ROUTE_PLANNER.selectingWaypoint = index;
    ROUTE_PLANNER.selectingStart = false;
    ROUTE_PLANNER.selectingEnd = false;

    showNotification('📍 Cliquez sur la carte pour placer l\'étape intermédiaire');

    // Écouter le prochain clic sur la carte
    APP_STATE.map.once('click', (e) => {
        ROUTE_PLANNER.waypoints[index] = [e.latlng.lat, e.latlng.lng];
        document.getElementById(`waypoint-input-${index}`).value = `📍 ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
        document.getElementById(`waypoint-input-${index}`).classList.add('selected');
        ROUTE_PLANNER.selectingWaypoint = false;

        addRouteMarker([e.latlng.lat, e.latlng.lng], 'waypoint', index);

        showNotification('✅ Étape intermédiaire définie');
    });
}

function removeWaypoint(index) {
    document.getElementById(`waypoint-${index}`)?.remove();
    ROUTE_PLANNER.waypoints.splice(index, 1);

    // Nettoyer le marqueur
    removeRouteMarkers('waypoint', index);

    showNotification('🗑️ Étape intermédiaire supprimée');
}

function addRouteMarker(position, type, index = null) {
    let iconHTML = '';
    let className = '';

    switch (type) {
    case 'start':
        iconHTML = '🅰️';
        className = 'route-marker-start';
        break;
    case 'end':
        iconHTML = '🅱️';
        className = 'route-marker-end';
        break;
    case 'waypoint':
        iconHTML = (index + 1).toString();
        className = 'route-marker-waypoint';
        break;
    }

    const marker = L.marker(position, {
        icon: L.divIcon({
            html: `<div class="${className}">${iconHTML}</div>`,
            className: '',
            iconSize: [40, 40]
        }),
        draggable: true
    }).addTo(APP_STATE.map);

    marker.routeType = type;
    marker.routeIndex = index;

    // Gérer le drag
    marker.on('dragend', (e) => {
        const newPos = [e.target.getLatLng().lat, e.target.getLatLng().lng];

        if (type === 'start') {
            ROUTE_PLANNER.startPoint = newPos;
            document.getElementById('startPoint').value = `📍 ${newPos[0].toFixed(4)}, ${newPos[1].toFixed(4)}`;
        } else if (type === 'end') {
            ROUTE_PLANNER.endPoint = newPos;
            document.getElementById('endPoint').value = `📍 ${newPos[0].toFixed(4)}, ${newPos[1].toFixed(4)}`;
        } else if (type === 'waypoint') {
            ROUTE_PLANNER.waypoints[index] = newPos;
            document.getElementById(`waypoint-input-${index}`).value = `📍 ${newPos[0].toFixed(4)}, ${newPos[1].toFixed(4)}`;
        }

        showNotification('📍 Point déplacé');
    });

    ROUTE_PLANNER.routeMarkers.push(marker);
}

function removeRouteMarkers(type, index = null) {
    ROUTE_PLANNER.routeMarkers = ROUTE_PLANNER.routeMarkers.filter(marker => {
        if (type && marker.routeType === type) {
            if (type === 'waypoint' && index !== null) {
                if (marker.routeIndex === index) {
                    marker.remove();
                    return false;
                }
            } else {
                marker.remove();
                return false;
            }
        }
        return true;
    });
}

async function calculateRoute() {
    if (!ROUTE_PLANNER.startPoint || !ROUTE_PLANNER.endPoint) {
        showNotification('❌ Veuillez définir un point de départ ET un point d\'arrivée');
        return;
    }

    showNotification('🔄 Calcul de l\'itinéraire en cours...');

    // Nettoyer l'ancien itinéraire
    if (ROUTE_PLANNER.currentRoute) {
        ROUTE_PLANNER.currentRoute.remove();
    }

    try {
        // Construire les coordonnées pour l'API
        const coordinates = [
            ROUTE_PLANNER.startPoint,
            ...ROUTE_PLANNER.waypoints.filter(w => w !== null),
            ROUTE_PLANNER.endPoint
        ];

        // Convertir en format lon,lat pour OSRM
        const coordsString = coordinates.map(coord => `${coord[1]},${coord[0]}`).join(';');

        // Appeler l'API OSRM pour calcul d'itinéraire piéton
        const url = `https://router.project-osrm.org/route/v1/foot/${coordsString}?overview=full&geometries=geojson&steps=true&alternatives=false`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            throw new Error('Impossible de calculer l\'itinéraire');
        }

        const route = data.routes[0];

        // Convertir les coordonnées GeoJSON en format Leaflet [lat, lng]
        const routeCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

        // Créer la ligne d'itinéraire RÉEL
        ROUTE_PLANNER.currentRoute = L.polyline(routeCoordinates, {
            color: '#FF6B35',
            weight: 6,
            opacity: 0.9,
            smoothFactor: 1,
            className: 'planned-route-line'
        }).addTo(APP_STATE.map);

        // Ajouter des flèches directionnelles
        const decorator = L.polylineDecorator(ROUTE_PLANNER.currentRoute, {
            patterns: [
                {
                    offset: 25,
                    repeat: 100,
                    symbol: L.Symbol.arrowHead({
                        pixelSize: 12,
                        polygon: false,
                        pathOptions: {
                            stroke: true,
                            color: '#FF6B35',
                            weight: 3
                        }
                    })
                }
            ]
        }).addTo(APP_STATE.map);

        ROUTE_PLANNER.routeMarkers.push(decorator);

        // Ajuster la vue pour montrer tout l'itinéraire
        APP_STATE.map.fitBounds(ROUTE_PLANNER.currentRoute.getBounds(), {
            padding: [50, 50]
        });

        // Extraire les instructions turn-by-turn
        const instructions = extractInstructions(route);
        ROUTE_PLANNER.instructions = instructions;

        // Calculer les statistiques RÉELLES
        const distance = route.distance / 1000; // Convertir en km
        const duration = route.duration / 60; // Convertir en minutes

        displayRouteStats(distance, duration, instructions);

        showNotification('✅ Itinéraire réel calculé avec succès !');

    } catch (error) {
        console.error('Erreur calcul itinéraire:', error);
        showNotification('❌ Erreur lors du calcul de l\'itinéraire. Essayez avec des points plus proches.');

        // Fallback : ligne droite simple
        calculateRouteFallback(coordinates);
    }
}

// Fonction fallback si l'API échoue
function calculateRouteFallback(coordinates) {
    ROUTE_PLANNER.currentRoute = L.polyline(coordinates, {
        color: '#FF6B35',
        weight: 5,
        opacity: 0.7,
        dashArray: '10, 10',
        smoothFactor: 1
    }).addTo(APP_STATE.map);

    APP_STATE.map.fitBounds(ROUTE_PLANNER.currentRoute.getBounds(), {
        padding: [50, 50]
    });

    calculateRouteStatsSimple(coordinates);
}

// Extraire les instructions de navigation
function extractInstructions(route) {
    const instructions = [];

    if (route.legs) {
        route.legs.forEach((leg, legIndex) => {
            if (leg.steps) {
                leg.steps.forEach((step, stepIndex) => {
                    const maneuver = step.maneuver;
                    const instruction = {
                        type: maneuver.type,
                        modifier: maneuver.modifier || '',
                        name: step.name || 'route sans nom',
                        distance: step.distance,
                        duration: step.duration,
                        location: [maneuver.location[1], maneuver.location[0]]
                    };
                    instructions.push(instruction);
                });
            }
        });
    }

    return instructions;
}

// Afficher les statistiques réelles
function displayRouteStats(distance, duration, instructions) {
    // Calculer l'allure réelle
    const pace = duration / distance; // min/km

    // Calories (plus précis avec la durée)
    const calories = Math.floor(distance * 60);

    // Afficher les infos
    document.getElementById('routeInfo').style.display = 'block';
    document.getElementById('routeDistance').textContent = `${distance.toFixed(2)  } km`;

    const hours = Math.floor(duration / 60);
    const minutes = Math.floor(duration % 60);
    document.getElementById('routeTime').textContent = hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`;

    document.getElementById('routePace').textContent = `${pace.toFixed(1)  } min/km`;
    document.getElementById('routeCalories').textContent = `${calories  } kcal`;

    // Afficher les instructions si disponibles
    displayNavigationInstructions(instructions);
}

// Afficher les instructions de navigation
function displayNavigationInstructions(instructions) {
    if (!instructions || instructions.length === 0) {
        return;
    }

    // Créer une section d'instructions dans le panneau
    let instructionsHTML = `
        <div class="route-instructions" style="margin-top: 1.5rem; max-height: 200px; overflow-y: auto;">
            <h4>🧭 Instructions de navigation</h4>
            <div class="instructions-list">
    `;

    instructions.forEach((instr, index) => {
        const icon = getInstructionIcon(instr.type, instr.modifier);
        const distanceText = instr.distance > 1000
            ? `${(instr.distance / 1000).toFixed(1)} km`
            : `${Math.round(instr.distance)} m`;

        instructionsHTML += `
            <div class="instruction-item" data-index="${index}">
                <span class="instruction-icon">${icon}</span>
                <div class="instruction-text">
                    <strong>${getInstructionText(instr.type, instr.modifier)}</strong>
                    ${instr.name ? `sur <em>${instr.name}</em>` : ''}
                    <br><small>${distanceText}</small>
                </div>
            </div>
        `;
    });

    instructionsHTML += `
            </div>
        </div>
    `;

    // Ajouter au panneau d'info
    const routeInfo = document.getElementById('routeInfo');
    const existingInstructions = routeInfo.querySelector('.route-instructions');
    if (existingInstructions) {
        existingInstructions.remove();
    }
    routeInfo.insertAdjacentHTML('beforeend', instructionsHTML);
}

// Obtenir l'icône pour chaque type d'instruction
function getInstructionIcon(type, modifier) {
    const icons = {
        'depart': '🏁',
        'arrive': '🎯',
        'turn': modifier === 'left' ? '↰' : modifier === 'right' ? '↱' : '➡️',
        'new name': '➡️',
        'continue': '⬆️',
        'roundabout': '🔄',
        'rotary': '🔄',
        'end of road': '⚠️',
        'fork': '🔱',
        'merge': '🔀'
    };

    return icons[type] || '➡️';
}

// Obtenir le texte d'instruction
function getInstructionText(type, modifier) {
    const texts = {
        'depart': 'Départ',
        'arrive': 'Arrivée',
        'turn': modifier === 'left' ? 'Tournez à gauche' :
            modifier === 'right' ? 'Tournez à droite' :
                modifier === 'slight left' ? 'Tournez légèrement à gauche' :
                    modifier === 'slight right' ? 'Tournez légèrement à droite' :
                        modifier === 'sharp left' ? 'Tournez fortement à gauche' :
                            modifier === 'sharp right' ? 'Tournez fortement à droite' : 'Tournez',
        'new name': 'Continuez',
        'continue': 'Continuez tout droit',
        'roundabout': 'Au rond-point',
        'rotary': 'Au rond-point',
        'end of road': 'Fin de route',
        'fork': 'Bifurcation',
        'merge': 'Rejoignez'
    };

    return texts[type] || 'Continuez';
}

// Calcul simple pour le fallback
function calculateRouteStatsSimple(path) {
    // Calculer la distance totale
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const distance = APP_STATE.map.distance(path[i], path[i + 1]);
        totalDistance += distance;
    }

    totalDistance = totalDistance / 1000; // Convertir en km

    // Estimer le temps (allure moyenne 6 min/km pour la course)
    const averagePace = 6; // min/km
    const estimatedTime = totalDistance * averagePace; // minutes
    const hours = Math.floor(estimatedTime / 60);
    const minutes = Math.floor(estimatedTime % 60);

    // Calories (environ 60 cal/km pour la course)
    const calories = Math.floor(totalDistance * 60);

    // Afficher les infos
    document.getElementById('routeInfo').style.display = 'block';
    document.getElementById('routeDistance').textContent = `${totalDistance.toFixed(2)  } km`;
    document.getElementById('routeTime').textContent = hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`;
    document.getElementById('routePace').textContent = `${averagePace  } min/km`;
    document.getElementById('routeCalories').textContent = `${calories  } kcal`;

    showNotification('⚠️ Itinéraire approximatif (ligne droite)');
}

function startNavigation() {
    if (!ROUTE_PLANNER.currentRoute) {
        showNotification('❌ Veuillez d\'abord calculer un itinéraire');
        return;
    }

    ROUTE_PLANNER.navigationActive = true;
    ROUTE_PLANNER.currentInstructionIndex = 0;

    // Créer l'interface de navigation améliorée
    const navDiv = document.createElement('div');
    navDiv.className = 'navigation-active';
    navDiv.id = 'navigationInterface';

    // Première instruction ou message général
    let firstInstruction = '🧭 Suivez l\'itinéraire tracé';
    if (ROUTE_PLANNER.instructions && ROUTE_PLANNER.instructions.length > 0) {
        const instr = ROUTE_PLANNER.instructions[0];
        firstInstruction = `${getInstructionIcon(instr.type, instr.modifier)} ${getInstructionText(instr.type, instr.modifier)}`;
        if (instr.name && instr.name !== 'route sans nom') {
            firstInstruction += ` sur ${instr.name}`;
        }
    }

    navDiv.innerHTML = `
        <div style="flex: 1;">
            <div class="nav-instruction" id="navInstruction">${firstInstruction}</div>
            <div class="nav-distance" id="navDistance">Distance restante: ${document.getElementById('routeDistance').textContent}</div>
        </div>
        <div style="display: flex; gap: 1rem;">
            <button class="nav-stop-btn" style="background: var(--secondary);" onclick="nextInstruction()">➡️ Suivante</button>
            <button class="nav-stop-btn" onclick="stopNavigation()">⏹️ Arrêter</button>
        </div>
    `;

    document.body.appendChild(navDiv);

    // Fermer le panneau de planification
    closeRoutePlanner();

    // Zoom sur le début de l'itinéraire
    if (ROUTE_PLANNER.startPoint) {
        APP_STATE.map.setView(ROUTE_PLANNER.startPoint, 16);
    }

    // Récompenses
    addXP(50);
    showNotification('🏃‍♂️ Navigation démarrée ! Suivez les instructions !');
}

function nextInstruction() {
    if (!ROUTE_PLANNER.instructions || ROUTE_PLANNER.instructions.length === 0) {
        showNotification('📍 Continuez de suivre l\'itinéraire tracé');
        return;
    }

    ROUTE_PLANNER.currentInstructionIndex++;

    if (ROUTE_PLANNER.currentInstructionIndex >= ROUTE_PLANNER.instructions.length) {
        showNotification('🎯 Vous approchez de votre destination !');
        ROUTE_PLANNER.currentInstructionIndex = ROUTE_PLANNER.instructions.length - 1;
        return;
    }

    const instr = ROUTE_PLANNER.instructions[ROUTE_PLANNER.currentInstructionIndex];
    let instructionText = `${getInstructionIcon(instr.type, instr.modifier)} ${getInstructionText(instr.type, instr.modifier)}`;
    if (instr.name && instr.name !== 'route sans nom') {
        instructionText += ` sur ${instr.name}`;
    }

    document.getElementById('navInstruction').textContent = instructionText;

    // Zoom sur la position de l'instruction
    if (instr.location) {
        APP_STATE.map.panTo(instr.location);
    }

    // Distance restante approximative
    let remainingDistance = 0;
    for (let i = ROUTE_PLANNER.currentInstructionIndex; i < ROUTE_PLANNER.instructions.length; i++) {
        remainingDistance += ROUTE_PLANNER.instructions[i].distance || 0;
    }

    const distanceText = remainingDistance > 1000
        ? `${(remainingDistance / 1000).toFixed(1)} km`
        : `${Math.round(remainingDistance)} m`;

    document.getElementById('navDistance').textContent = `Distance restante: ${distanceText}`;

    showNotification(`📍 ${instructionText}`);
}

function stopNavigation() {
    ROUTE_PLANNER.navigationActive = false;
    document.getElementById('navigationInterface')?.remove();

    // Bonus de fin de course
    addXP(100);
    addCoins(50);

    showNotification('🎉 Navigation terminée ! +100 XP, +50 coins');
}

function clearRoute() {
    // Supprimer l'itinéraire de la carte
    if (ROUTE_PLANNER.currentRoute) {
        ROUTE_PLANNER.currentRoute.remove();
        ROUTE_PLANNER.currentRoute = null;
    }

    // Supprimer tous les marqueurs
    ROUTE_PLANNER.routeMarkers.forEach(marker => marker.remove());
    ROUTE_PLANNER.routeMarkers = [];

    // Réinitialiser les points
    ROUTE_PLANNER.startPoint = null;
    ROUTE_PLANNER.endPoint = null;
    ROUTE_PLANNER.waypoints = [];

    // Réinitialiser l'interface
    document.getElementById('startPoint').value = '';
    document.getElementById('startPoint').classList.remove('selected');
    document.getElementById('endPoint').value = '';
    document.getElementById('endPoint').classList.remove('selected');
    document.getElementById('waypointsContainer').innerHTML = '';
    document.getElementById('routeInfo').style.display = 'none';

    showNotification('🗑️ Itinéraire effacé');
}

function saveRoute() {
    if (!ROUTE_PLANNER.currentRoute) {
        showNotification('❌ Aucun itinéraire à sauvegarder');
        return;
    }

    const routeName = prompt('Nom de l\'itinéraire:', `Itinéraire ${new Date().toLocaleDateString()}`);

    if (routeName) {
        const route = {
            id: Date.now(),
            name: routeName,
            start: ROUTE_PLANNER.startPoint,
            end: ROUTE_PLANNER.endPoint,
            waypoints: [...ROUTE_PLANNER.waypoints],
            distance: document.getElementById('routeDistance').textContent,
            time: document.getElementById('routeTime').textContent,
            date: new Date().toISOString()
        };

        ROUTE_PLANNER.savedRoutes.push(route);
        localStorage.setItem('paceMateRoutes', JSON.stringify(ROUTE_PLANNER.savedRoutes));

        displaySavedRoutes();

        showNotification('💾 Itinéraire sauvegardé !');
    }
}

function loadSavedRoutes() {
    const saved = localStorage.getItem('paceMateRoutes');
    if (saved) {
        ROUTE_PLANNER.savedRoutes = JSON.parse(saved);
        displaySavedRoutes();
    }
}

function displaySavedRoutes() {
    if (ROUTE_PLANNER.savedRoutes.length === 0) {
        document.getElementById('savedRoutes').style.display = 'none';
        return;
    }

    document.getElementById('savedRoutes').style.display = 'block';

    const listEl = document.getElementById('savedRoutesList');
    listEl.innerHTML = ROUTE_PLANNER.savedRoutes.map(route => `
        <div class="saved-route-item" onclick="loadRoute(${route.id})">
            <div class="saved-route-info">
                <div class="saved-route-name">📍 ${route.name}</div>
                <div class="saved-route-details">${route.distance} • ${route.time}</div>
            </div>
            <div class="saved-route-actions">
                <button onclick="event.stopPropagation(); loadRoute(${route.id})">📂</button>
                <button onclick="event.stopPropagation(); deleteRoute(${route.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function loadRoute(routeId) {
    const route = ROUTE_PLANNER.savedRoutes.find(r => r.id === routeId);
    if (!route) {
        return;
    }

    // Nettoyer l'itinéraire actuel
    clearRoute();

    // Charger les points
    ROUTE_PLANNER.startPoint = route.start;
    ROUTE_PLANNER.endPoint = route.end;
    ROUTE_PLANNER.waypoints = [...route.waypoints];

    // Mettre à jour l'interface
    document.getElementById('startPoint').value = `📍 ${route.start[0].toFixed(4)}, ${route.start[1].toFixed(4)}`;
    document.getElementById('startPoint').classList.add('selected');
    document.getElementById('endPoint').value = `📍 ${route.end[0].toFixed(4)}, ${route.end[1].toFixed(4)}`;
    document.getElementById('endPoint').classList.add('selected');

    // Ajouter les marqueurs
    addRouteMarker(route.start, 'start');
    addRouteMarker(route.end, 'end');

    // Waypoints
    route.waypoints.forEach((waypoint, index) => {
        if (waypoint) {
            addWaypoint();
            ROUTE_PLANNER.waypoints[index] = waypoint;
            document.getElementById(`waypoint-input-${index}`).value = `📍 ${waypoint[0].toFixed(4)}, ${waypoint[1].toFixed(4)}`;
            addRouteMarker(waypoint, 'waypoint', index);
        }
    });

    // Recalculer l'itinéraire
    calculateRoute();

    showNotification(`📂 Itinéraire "${route.name}" chargé`);
}

function deleteRoute(routeId) {
    ROUTE_PLANNER.savedRoutes = ROUTE_PLANNER.savedRoutes.filter(r => r.id !== routeId);
    localStorage.setItem('paceMateRoutes', JSON.stringify(ROUTE_PLANNER.savedRoutes));
    displaySavedRoutes();
    showNotification('🗑️ Itinéraire supprimé');
}

function shareRoute() {
    if (!ROUTE_PLANNER.currentRoute) {
        showNotification('❌ Aucun itinéraire à partager');
        return;
    }

    const routeData = {
        start: ROUTE_PLANNER.startPoint,
        end: ROUTE_PLANNER.endPoint,
        waypoints: ROUTE_PLANNER.waypoints,
        distance: document.getElementById('routeDistance').textContent
    };

    const routeLink = `https://pacemate.app/route/${btoa(JSON.stringify(routeData))}`;

    // Copier dans le presse-papier
    navigator.clipboard.writeText(routeLink).then(() => {
        showNotification('📤 Lien de l\'itinéraire copié !');
    }).catch(() => {
        showNotification('📤 Itinéraire prêt à être partagé !');
    });
}

// Rendre les fonctions accessibles globalement pour les onclick
window.showRunnerModal = showRunnerModal;
window.completeChallenge = completeChallenge;
window.purchaseItem = purchaseItem;
window.sendRunRequest = sendRunRequest;
window.openChat = openChat;
window.startGame = startGame;
window.quitGame = quitGame;
window.captureZone = captureZone;
window.switchTeam = switchTeam;
window.claimHill = claimHill;
window.passRelay = passRelay;
window.defendZone = defendZone;
window.changeMapStyle = changeMapStyle;
window.applyMapFilters = applyMapFilters;
window.createRoute = createRoute;
window.closeRoutePlanner = closeRoutePlanner;
window.selectStartPoint = selectStartPoint;
window.selectEndPoint = selectEndPoint;
window.addWaypoint = addWaypoint;
window.selectWaypoint = selectWaypoint;
window.removeWaypoint = removeWaypoint;
window.calculateRoute = calculateRoute;
window.startNavigation = startNavigation;
window.stopNavigation = stopNavigation;
window.clearRoute = clearRoute;
window.saveRoute = saveRoute;
window.loadRoute = loadRoute;
window.deleteRoute = deleteRoute;
window.shareRoute = shareRoute;
window.nextInstruction = nextInstruction;

console.log('✅ PaceMate initialisé !');

