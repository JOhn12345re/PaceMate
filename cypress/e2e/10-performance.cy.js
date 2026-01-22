/// <reference types="cypress" />

describe('⚡ Performance et Optimisation', () => {
    it('Devrait charger la page rapidement', () => {
        const start = Date.now();
        cy.visit('/');
        cy.get('.navbar').should('be.visible');
        const end = Date.now();
        const loadTime = end - start;

        expect(loadTime).to.be.lessThan(3000); // Moins de 3 secondes
    });

    it('Devrait charger Leaflet efficacement', () => {
        cy.visit('/');
        cy.get('[data-view="map"]').click();

        const start = Date.now();
        cy.get('.leaflet-container').should('exist');
        const end = Date.now();
        const mapLoadTime = end - start;

        expect(mapLoadTime).to.be.lessThan(2000);
    });

    it('Devrait naviguer entre les vues sans lag', () => {
        cy.visit('/');

        const views = ['challenges', 'minigames', 'leaderboard', 'friends', 'shop', 'profile', 'map'];

        views.forEach((view) => {
            const start = Date.now();
            cy.get(`[data-view="${view}"]`).click();
            cy.get(`#${view}View`).should('have.class', 'active');
            const end = Date.now();
            const transitionTime = end - start;

            expect(transitionTime).to.be.lessThan(500);
        });
    });

    it('Devrait animer les transitions fluidement', () => {
        cy.visit('/');

        cy.get('[data-view="challenges"]').click();
        cy.get('#challengesView').should('have.css', 'transition');
    });

    it('Devrait gérer de multiples notifications sans ralentissement', () => {
        cy.visit('/');

        cy.window().then((win) => {
            for (let i = 0; i < 5; i++) {
                win.showNotification(`Notification ${i}`, 'info');
                cy.wait(100);
            }
        });

        // L'application ne devrait pas freezer
        cy.get('.sidebar-btn').first().should('be.visible');
    });

    it('Devrait afficher les coureurs sur la carte sans lag', () => {
        cy.visit('/');
        cy.get('[data-view="map"]').click();
        cy.wait(1000);

        // Vérifier que les marqueurs sont présents
        cy.get('.runner-card').should('have.length.at.least', 1);
    });

    it('Devrait calculer un itinéraire rapidement', () => {
        cy.visit('/');
        cy.get('[data-view="map"]').click();
        cy.get('#planRouteBtn').click();

        cy.window().then((win) => {
            win.ROUTE_PLANNER.startPoint = [48.8566, 2.3522];
            win.ROUTE_PLANNER.endPoint = [48.8606, 2.3376];
        });

        const start = Date.now();
        cy.get('.route-options .btn-primary').click();
        cy.get('#routeInfo').should('be.visible');
        const end = Date.now();
        const calcTime = end - start;

        expect(calcTime).to.be.lessThan(1500);
    });

    it('Devrait démarrer un mini-jeu sans délai', () => {
        cy.visit('/');
        cy.get('[data-view="minigames"]').click();

        const start = Date.now();
        cy.get('[data-game="territory"] .game-btn').click();
        cy.get('#activeGameSection').should('be.visible');
        const end = Date.now();
        const startTime = end - start;

        expect(startTime).to.be.lessThan(1000);
    });

    it('Devrait avoir des images optimisées (pas d\'images lourdes)', () => {
        cy.visit('/');

        // Vérifier qu'il n'y a pas d'images en base64 trop grandes
        cy.get('img').each(($img) => {
            cy.wrap($img).should('have.attr', 'src').then((src) => {
                if (src.startsWith('data:')) {
                    // Si c'est une image base64, elle ne devrait pas être trop grande
                    expect(src.length).to.be.lessThan(50000); // ~50KB max
                }
            });
        });
    });

    it('Devrait utiliser le LocalStorage efficacement', () => {
        cy.visit('/');

        cy.getAllLocalStorage().then((storage) => {
            const origin = Object.keys(storage)[0];
            const totalSize = JSON.stringify(storage[origin]).length;

            // Le localStorage ne devrait pas dépasser 1MB
            expect(totalSize).to.be.lessThan(1000000);
        });
    });

    it('Ne devrait pas avoir de memory leaks lors des changements de vue', () => {
        cy.visit('/');

        // Changer de vue plusieurs fois
        for (let i = 0; i < 10; i++) {
            cy.get('[data-view="map"]').click();
            cy.wait(200);
            cy.get('[data-view="challenges"]').click();
            cy.wait(200);
        }

        // L'application devrait toujours répondre
        cy.get('.sidebar-btn').first().should('be.visible');
    });

    it('Devrait gérer le scroll smoothement', () => {
        cy.visit('/');
        cy.get('[data-view="challenges"]').click();

        cy.get('.challenges-container').scrollTo('bottom', { duration: 500 });
        cy.get('.challenges-container').scrollTo('top', { duration: 500 });

        // Vérifier que l'élément est toujours visible
        cy.get('.challenges-section').first().should('be.visible');
    });
});

