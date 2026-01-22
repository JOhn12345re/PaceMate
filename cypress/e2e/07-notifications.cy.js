/// <reference types="cypress" />

describe('🔔 Système de Notifications', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(500);
    });

    it('Devrait afficher une notification de bienvenue', () => {
        cy.get('.notification-toast').should('exist');
    });

    it('Devrait afficher une notification lors de la localisation', () => {
        cy.get('[data-view="map"]').click();
        cy.get('#locateMe').click();

        cy.get('.notification-toast.show').should('be.visible');
        cy.wait(3500);
        cy.get('.notification-toast.show').should('not.exist');
    });

    it('Devrait afficher une notification lors du changement de style de carte', () => {
        cy.get('[data-view="map"]').click();
        cy.get('#toggleMapStyle').click();
        cy.get('[data-style="dark"]').click();

        cy.get('.notification-toast').should('contain', 'Style');
    });

    it('Devrait afficher une notification lors de l\'ouverture du planificateur', () => {
        cy.get('[data-view="map"]').click();
        cy.get('#planRouteBtn').click();

        cy.get('.notification-toast').should('be.visible');
    });

    it('Devrait afficher une notification lors de l\'ajout d\'XP', () => {
        cy.window().then((win) => {
            win.addXP(50);
        });

        cy.get('.notification-toast').should('contain', 'XP');
    });

    it('Devrait afficher une notification lors de l\'ajout de coins', () => {
        cy.window().then((win) => {
            win.addCoins(100);
        });

        cy.get('.notification-toast').should('contain', 'coins');
    });

    it('Devrait afficher une notification lors du démarrage d\'un jeu', () => {
        cy.get('[data-view="minigames"]').click();
        cy.get('[data-game="territory"] .game-btn').click();

        cy.get('.notification-toast').should('be.visible');
    });

    it('Devrait afficher différents types de notifications', () => {
        cy.window().then((win) => {
            // Notification de succès
            win.showNotification('Test succès', 'success');
        });
        cy.get('.notification-toast.success').should('be.visible');
        cy.wait(3500);

        cy.window().then((win) => {
            // Notification d'erreur
            win.showNotification('Test erreur', 'error');
        });
        cy.get('.notification-toast.error').should('be.visible');
    });

    it('Devrait faire disparaître la notification après 3 secondes', () => {
        cy.window().then((win) => {
            win.showNotification('Test temporaire', 'info');
        });

        cy.get('.notification-toast.show').should('be.visible');
        cy.wait(3500);
        cy.get('.notification-toast.show').should('not.exist');
    });
});

