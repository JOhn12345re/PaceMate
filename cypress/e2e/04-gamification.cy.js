/// <reference types="cypress" />

describe('🎮 Système de Gamification', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(500);
    });

    it('Devrait afficher les statistiques initiales de l\'utilisateur', () => {
        cy.get('#userCoins').should('contain', '0');
        cy.get('#userLevel').should('contain', '1');
        cy.get('#userXP').should('contain', '0');
    });

    it('Devrait naviguer vers la vue Défis', () => {
        cy.get('[data-view="challenges"]').click();
        cy.get('#challengesView').should('have.class', 'active');
    });

    it('Devrait afficher les défis quotidiens', () => {
        cy.get('[data-view="challenges"]').click();
        cy.get('#dailyChallengesList').should('be.visible');
        cy.get('.challenge-card').should('have.length.at.least', 1);
    });

    it('Devrait afficher les défis hebdomadaires', () => {
        cy.get('[data-view="challenges"]').click();
        cy.get('#weeklyChallengesList').should('be.visible');
    });

    it('Devrait afficher les informations du défi', () => {
        cy.get('[data-view="challenges"]').click();

        cy.get('.challenge-card').first().within(() => {
            cy.get('.challenge-icon').should('be.visible');
            cy.get('.challenge-title').should('be.visible');
            cy.get('.challenge-description').should('be.visible');
            cy.get('.challenge-reward').should('be.visible');
            cy.get('.challenge-progress').should('be.visible');
        });
    });

    it('Devrait naviguer vers la boutique', () => {
        cy.get('[data-view="shop"]').click();
        cy.get('#shopView').should('have.class', 'active');
    });

    it('Devrait afficher les articles de la boutique', () => {
        cy.get('[data-view="shop"]').click();
        cy.get('.shop-item').should('have.length.at.least', 1);
    });

    it('Devrait afficher les détails d\'un article', () => {
        cy.get('[data-view="shop"]').click();

        cy.get('.shop-item').first().within(() => {
            cy.get('.shop-item-icon').should('be.visible');
            cy.get('.shop-item-name').should('be.visible');
            cy.get('.shop-item-description').should('be.visible');
            cy.get('.shop-item-price').should('be.visible');
        });
    });

    it('Devrait afficher les coins dans la boutique', () => {
        cy.get('[data-view="shop"]').click();
        cy.get('#shopCoins').should('be.visible');
    });

    it('Devrait naviguer vers le profil', () => {
        cy.get('[data-view="profile"]').click();
        cy.get('#profileView').should('have.class', 'active');
    });

    it('Devrait afficher les informations du profil', () => {
        cy.get('[data-view="profile"]').click();

        cy.get('.profile-header').should('be.visible');
        cy.get('#profileName').should('be.visible');
        cy.get('#profileLevel').should('be.visible');
        cy.get('#profileCoins').should('be.visible');
        cy.get('#profileXP').should('be.visible');
    });

    it('Devrait afficher les statistiques du profil', () => {
        cy.get('[data-view="profile"]').click();

        cy.get('#totalRuns').should('be.visible');
        cy.get('#totalDistance').should('be.visible');
        cy.get('#totalTime').should('be.visible');
        cy.get('#currentStreak').should('be.visible');
    });

    it('Devrait afficher la collection de badges', () => {
        cy.get('[data-view="profile"]').click();
        cy.get('#allBadges').should('be.visible');
        cy.get('.badge-item').should('have.length.at.least', 1);
    });

    it('Devrait augmenter l\'XP (simulation)', () => {
        cy.window().then((win) => {
            const initialXP = win.APP_STATE.user.xp;
            win.addXP(50);
            expect(win.APP_STATE.user.xp).to.be.greaterThan(initialXP);
        });

        cy.get('#userXP').should('not.contain', '0');
    });

    it('Devrait augmenter les coins (simulation)', () => {
        cy.window().then((win) => {
            const initialCoins = win.APP_STATE.user.coins;
            win.addCoins(100);
            expect(win.APP_STATE.user.coins).to.be.greaterThan(initialCoins);
        });

        cy.get('#userCoins').should('not.contain', '0');
    });

    it('Devrait mettre à jour la barre de progression XP', () => {
        cy.window().then((win) => {
            win.addXP(50);
        });

        cy.get('.xp-progress').should('have.css', 'width').and('not.equal', '0px');
    });
});

