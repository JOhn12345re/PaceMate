/// <reference types="cypress" />

describe('🧭 Navigation et Structure', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(500);
    });

    it('Devrait charger la page principale', () => {
        cy.get('.navbar').should('be.visible');
        cy.get('.sidebar').should('be.visible');
        cy.get('.content-area').should('be.visible');
    });

    it('Devrait afficher le logo PaceMate', () => {
        cy.get('.nav-logo').should('contain', 'PaceMate');
        cy.get('.logo-icon').should('contain', '🏃‍♂️');
    });

    it('Devrait afficher les statistiques utilisateur', () => {
        cy.get('#userCoins').should('be.visible');
        cy.get('#userLevel').should('be.visible');
        cy.get('#userXP').should('be.visible');
        cy.get('.xp-progress').should('be.visible');
    });

    it('Devrait naviguer vers toutes les vues', () => {
        const views = [
            { selector: '[data-view="map"]', viewId: 'mapView' },
            { selector: '[data-view="challenges"]', viewId: 'challengesView' },
            { selector: '[data-view="minigames"]', viewId: 'minigamesView' },
            { selector: '[data-view="leaderboard"]', viewId: 'leaderboardView' },
            { selector: '[data-view="friends"]', viewId: 'friendsView' },
            { selector: '[data-view="shop"]', viewId: 'shopView' },
            { selector: '[data-view="profile"]', viewId: 'profileView' }
        ];

        views.forEach(({ selector, viewId }) => {
            cy.get(selector).click();
            cy.get(`#${viewId}`).should('have.class', 'active');
            cy.wait(300);
        });
    });

    it('Devrait mettre en évidence le bouton actif de la sidebar', () => {
        cy.get('[data-view="challenges"]').click();
        cy.get('[data-view="challenges"]').should('have.class', 'active');
        cy.get('[data-view="map"]').should('not.have.class', 'active');
    });

    it('Devrait afficher les défis du jour dans la sidebar', () => {
        cy.get('#dailyChallenges').should('be.visible');
        cy.get('.challenge-mini').should('have.length.at.least', 1);
    });

    it('Devrait afficher les badges dans la sidebar', () => {
        cy.get('#userBadges').should('be.visible');
        cy.get('.badge-mini').should('have.length.at.least', 1);
    });
});

