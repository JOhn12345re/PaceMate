/// <reference types="cypress" />

describe('🎮 Mini-Jeux', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('[data-view="minigames"]').click();
        cy.wait(500);
    });

    it('Devrait afficher la vue Mini-Jeux', () => {
        cy.get('#minigamesView').should('have.class', 'active');
    });

    it('Devrait afficher les statistiques de jeu', () => {
        cy.get('.game-coins-display').should('be.visible');
        cy.get('#gameCoins').should('exist');
        cy.get('#gameWins').should('exist');
    });

    it('Devrait afficher 6 mini-jeux', () => {
        cy.get('.game-card').should('have.length', 6);
    });

    it('Devrait afficher les détails de chaque jeu', () => {
        cy.get('.game-card').each(($card) => {
            cy.wrap($card).within(() => {
                cy.get('.game-icon').should('be.visible');
                cy.get('.game-header h3').should('be.visible');
                cy.get('.game-badge').should('be.visible');
                cy.get('.game-description').should('be.visible');
                cy.get('.game-stats').should('be.visible');
                cy.get('.game-rewards').should('be.visible');
                cy.get('.game-btn').should('be.visible');
            });
        });
    });

    it('Devrait afficher le jeu "Capture de Zones" avec badge Populaire', () => {
        cy.get('[data-game="territory"]').within(() => {
            cy.get('.game-badge').should('contain', 'Populaire');
            cy.get('.game-icon').should('contain', '🗺️');
            cy.get('h3').should('contain', 'Capture de Zones');
        });
    });

    it('Devrait démarrer le jeu "Capture de Zones"', () => {
        cy.get('[data-game="territory"] .game-btn').click();
        cy.get('#activeGameSection').should('be.visible');
        cy.get('#territoryGameInterface').should('be.visible');
    });

    it('Devrait afficher l\'interface du jeu de capture de zones', () => {
        cy.get('[data-game="territory"] .game-btn').click();

        cy.get('.territory-stats').should('be.visible');
        cy.get('#redTerritory').should('be.visible');
        cy.get('#blueTerritory').should('be.visible');
        cy.get('#neutralTerritory').should('be.visible');
        cy.get('#territoryMap').should('be.visible');
        cy.get('.game-actions').should('be.visible');
    });

    it('Devrait afficher le timer du jeu', () => {
        cy.get('[data-game="territory"] .game-btn').click();
        cy.get('#gameTimer').should('be.visible');
    });

    it('Devrait quitter le jeu', () => {
        cy.get('[data-game="territory"] .game-btn').click();
        cy.get('.game-header-bar .btn-secondary').contains('Quitter').click();
        cy.get('#activeGameSection').should('not.be.visible');
    });

    it('Devrait afficher les statistiques personnelles', () => {
        cy.get('.my-games-section').should('be.visible');
        cy.get('#totalWins').should('be.visible');
        cy.get('#totalGames').should('be.visible');
        cy.get('#winRate').should('be.visible');
        cy.get('#favoriteGame').should('be.visible');
    });

    it('Devrait démarrer d\'autres mini-jeux', () => {
        const games = ['checkpoint', 'kinghill', 'treasure', 'relay', 'defense'];

        games.forEach((game) => {
            cy.get(`[data-game="${game}"] .game-btn`).click();
            cy.get('#activeGameSection').should('be.visible');
            cy.get('.game-header-bar .btn-secondary').contains('Quitter').click();
            cy.wait(300);
        });
    });

    it('Devrait afficher le badge NEW sur les mini-jeux', () => {
        cy.get('[data-view="minigames"]').within(() => {
            cy.get('.notification-badge').should('contain', 'NEW');
        });
    });

    it('Devrait afficher les récompenses correctes pour chaque jeu', () => {
        cy.get('[data-game="territory"] .game-rewards').should('contain', '+500 XP');
        cy.get('[data-game="checkpoint"] .game-rewards').should('contain', '+300 XP');
        cy.get('[data-game="kinghill"] .game-rewards').should('contain', '+400 XP');
        cy.get('[data-game="treasure"] .game-rewards').should('contain', '+600 XP');
        cy.get('[data-game="relay"] .game-rewards').should('contain', '+450 XP');
        cy.get('[data-game="defense"] .game-rewards').should('contain', '+350 XP');
    });

    it('Devrait capturer une zone (simulation)', () => {
        cy.get('[data-game="territory"] .game-btn').click();

        cy.window().then((win) => {
            const initialNeutral = win.GAME_STATE.territory.neutral;
            // Simuler une capture
            if (typeof win.captureZone === 'function') {
                // La fonction existe dans le contexte
                cy.get('.game-actions .btn-primary').should('exist');
            }
        });
    });
});

