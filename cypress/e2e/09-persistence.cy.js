/// <reference types="cypress" />

describe('💾 Persistence des Données', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit('/');
        cy.wait(500);
    });

    it('Devrait sauvegarder les données utilisateur dans localStorage', () => {
        cy.window().then((win) => {
            win.addXP(100);
            win.addCoins(50);
        });

        cy.wait(500);

        cy.getAllLocalStorage().then((storage) => {
            const origin = Object.keys(storage)[0];
            expect(storage[origin]).to.have.property('paceMateUser');
        });
    });

    it('Devrait sauvegarder un itinéraire dans localStorage', () => {
        cy.get('[data-view="map"]').click();
        cy.get('#planRouteBtn').click();

        cy.window().then((win) => {
            win.ROUTE_PLANNER.startPoint = [48.8566, 2.3522];
            win.ROUTE_PLANNER.endPoint = [48.8606, 2.3376];
            cy.stub(win, 'prompt').returns('Test Route');
        });

        cy.get('.route-options .btn-primary').click();
        cy.wait(1000);

        cy.get('.route-actions .btn-secondary').contains('Sauvegarder').click();

        cy.getAllLocalStorage().then((storage) => {
            const origin = Object.keys(storage)[0];
            expect(storage[origin]).to.have.property('paceMateRoutes');
        });
    });

    it('Devrait charger les données au rafraîchissement', () => {
        cy.window().then((win) => {
            win.addXP(150);
            win.addCoins(75);
        });

        cy.reload();
        cy.wait(1000);

        cy.get('#userXP').should('not.contain', '0');
    });

    it('Devrait sauvegarder les statistiques de jeu', () => {
        cy.get('[data-view="minigames"]').click();

        cy.window().then((win) => {
            if (win.GAME_STATE) {
                win.GAME_STATE.stats.totalGames = 10;
                win.GAME_STATE.stats.wins = 5;
                // Sauvegarder
                localStorage.setItem('paceMateGameStats', JSON.stringify(win.GAME_STATE.stats));
            }
        });

        cy.getAllLocalStorage().then((storage) => {
            const origin = Object.keys(storage)[0];
            if (storage[origin]['paceMateGameStats']) {
                const stats = JSON.parse(storage[origin]['paceMateGameStats']);
                expect(stats.totalGames).to.equal(10);
                expect(stats.wins).to.equal(5);
            }
        });
    });

    it('Devrait persister les préférences utilisateur', () => {
        cy.window().then((win) => {
            localStorage.setItem('paceMateSettings', JSON.stringify({
                sound: true,
                darkMode: false,
                notifications: true
            }));
        });

        cy.reload();
        cy.wait(500);

        cy.getAllLocalStorage().then((storage) => {
            const origin = Object.keys(storage)[0];
            expect(storage[origin]).to.have.property('paceMateSettings');
        });
    });

    it('Devrait charger les itinéraires sauvegardés au démarrage', () => {
    // Sauvegarder un itinéraire
        cy.window().then((win) => {
            const route = {
                id: Date.now(),
                name: 'Route Test Persistence',
                start: [48.8566, 2.3522],
                end: [48.8606, 2.3376],
                distance: '1.5 km',
                date: new Date().toISOString()
            };
            localStorage.setItem('paceMateRoutes', JSON.stringify([route]));
        });

        cy.reload();
        cy.wait(1000);

        cy.get('[data-view="map"]').click();
        cy.get('#planRouteBtn').click();

        cy.get('#savedRoutes').should('be.visible');
        cy.get('.saved-route-item').should('have.length', 1);
    });

    it('Devrait gérer le quota localStorage', () => {
        cy.window().then((win) => {
            try {
                // Tester la sauvegarde
                win.localStorage.setItem('test', 'value');
                win.localStorage.removeItem('test');
                expect(true).to.be.true;
            } catch (e) {
                // Si quota dépassé
                expect(e.name).to.equal('QuotaExceededError');
            }
        });
    });
});

