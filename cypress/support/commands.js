// ***********************************************
// Custom commands for PaceMate testing
// ***********************************************

// Command pour attendre que Leaflet soit chargé
Cypress.Commands.add('waitForLeaflet', () => {
    cy.window().then((win) => {
        return new Cypress.Promise((resolve) => {
            const checkLeaflet = () => {
                if (win.L && win.APP_STATE && win.APP_STATE.map) {
                    resolve();
                } else {
                    setTimeout(checkLeaflet, 100);
                }
            };
            checkLeaflet();
        });
    });
});

// Command pour simuler l'ajout d'XP
Cypress.Commands.add('addXP', (amount) => {
    cy.window().then((win) => {
        win.addXP(amount);
    });
});

// Command pour simuler l'ajout de coins
Cypress.Commands.add('addCoins', (amount) => {
    cy.window().then((win) => {
        win.addCoins(amount);
    });
});

// Command pour démarrer un mini-jeu
Cypress.Commands.add('startMiniGame', (gameType) => {
    cy.get('[data-view="minigames"]').click();
    cy.get(`[data-game="${gameType}"] .game-btn`).click();
    cy.wait(500);
});

// Command pour quitter un mini-jeu
Cypress.Commands.add('quitMiniGame', () => {
    cy.get('.game-header-bar .btn-secondary').contains('Quitter').click();
    cy.wait(300);
});

// Command pour ouvrir le planificateur d'itinéraire
Cypress.Commands.add('openRoutePlanner', () => {
    cy.get('[data-view="map"]').click();
    cy.wait(500);
    cy.get('#planRouteBtn').click();
    cy.wait(300);
});

// Command pour créer un itinéraire de test
Cypress.Commands.add('createTestRoute', () => {
    cy.openRoutePlanner();

    cy.window().then((win) => {
        win.ROUTE_PLANNER.startPoint = [48.8566, 2.3522];
        win.ROUTE_PLANNER.endPoint = [48.8606, 2.3376];
    });

    cy.get('.route-options .btn-primary').click();
    cy.wait(1000);
});

// Command pour vérifier qu'une notification est affichée
Cypress.Commands.add('checkNotification', (message, type = 'info') => {
    cy.get('.notification-toast.show')
        .should('be.visible')
        .and('contain', message)
        .and('have.class', type);
});

// Command pour naviguer vers une vue spécifique
Cypress.Commands.add('goToView', (viewName) => {
    cy.get(`[data-view="${viewName}"]`).click();
    cy.get(`#${viewName}View`).should('have.class', 'active');
});

// Command pour simuler la géolocalisation
Cypress.Commands.add('mockGeolocation', (latitude = 48.8566, longitude = 2.3522) => {
    cy.window().then((win) => {
        cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((success) => {
            success({
                coords: {
                    latitude,
                    longitude,
                    accuracy: 10
                }
            });
        });
    });
});

// Command pour nettoyer toutes les données de test
Cypress.Commands.add('cleanupTestData', () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.reload();
});

// Command pour vérifier l'état du jeu
Cypress.Commands.add('checkGameState', (property, expectedValue) => {
    cy.window().then((win) => {
        expect(win.GAME_STATE).to.have.property(property);
        if (expectedValue !== undefined) {
            expect(win.GAME_STATE[property]).to.equal(expectedValue);
        }
    });
});

// Command pour vérifier l'état de l'utilisateur
Cypress.Commands.add('checkUserState', (property, comparison, value) => {
    cy.window().then((win) => {
        const userValue = win.APP_STATE.user[property];

        switch (comparison) {
        case 'equals':
            expect(userValue).to.equal(value);
            break;
        case 'greaterThan':
            expect(userValue).to.be.greaterThan(value);
            break;
        case 'lessThan':
            expect(userValue).to.be.lessThan(value);
            break;
        default:
            expect(userValue).to.exist;
        }
    });
});

// Command pour attendre une animation
Cypress.Commands.add('waitForAnimation', (duration = 500) => {
    cy.wait(duration);
});

// Command pour simuler un achat dans la boutique
Cypress.Commands.add('purchaseShopItem', (itemIndex = 0) => {
    cy.goToView('shop');
    cy.get('.shop-item').eq(itemIndex).click();
});

// Command pour compléter un défi
Cypress.Commands.add('completeChallenge', (challengeIndex = 0) => {
    cy.goToView('challenges');
    cy.window().then((win) => {
        if (win.completeChallenge) {
            win.completeChallenge(challengeIndex);
        }
    });
});

// Command pour vérifier la présence d'éléments clés
Cypress.Commands.add('checkCoreElements', () => {
    cy.get('.navbar').should('be.visible');
    cy.get('.sidebar').should('be.visible');
    cy.get('.content-area').should('be.visible');
    cy.get('#userCoins').should('be.visible');
    cy.get('#userLevel').should('be.visible');
    cy.get('#userXP').should('be.visible');
});

// Command pour simuler une capture de zone
Cypress.Commands.add('captureZone', (zoneId = 0) => {
    cy.window().then((win) => {
        if (win.captureZone) {
            win.captureZone(zoneId);
        }
    });
});

// Command pour changer le style de carte
Cypress.Commands.add('changeMapStyle', (style = 'dark') => {
    cy.get('[data-view="map"]').click();
    cy.get('#toggleMapStyle').click();
    cy.get(`[data-style="${style}"]`).click();
    cy.wait(300);
});

// Command pour mesurer le temps d'exécution
Cypress.Commands.add('measurePerformance', (taskName, callback) => {
    const start = Date.now();
    callback();
    const end = Date.now();
    const duration = end - start;

    cy.log(`${taskName} took ${duration}ms`);

    return cy.wrap(duration);
});

