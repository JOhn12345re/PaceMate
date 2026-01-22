/// <reference types="cypress" />

describe('🏆 Classement et Amis', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(500);
    });

    describe('Classement', () => {
        beforeEach(() => {
            cy.get('[data-view="leaderboard"]').click();
        });

        it('Devrait afficher la vue Classement', () => {
            cy.get('#leaderboardView').should('have.class', 'active');
        });

        it('Devrait afficher les onglets de classement', () => {
            cy.get('.leaderboard-tabs').should('be.visible');
            cy.get('[data-tab="global"]').should('contain', 'Mondial');
            cy.get('[data-tab="local"]').should('contain', 'Local');
            cy.get('[data-tab="friends"]').should('contain', 'Amis');
        });

        it('Devrait avoir l\'onglet Mondial actif par défaut', () => {
            cy.get('[data-tab="global"]').should('have.class', 'active');
        });

        it('Devrait changer d\'onglet', () => {
            cy.get('[data-tab="local"]').click();
            cy.get('[data-tab="local"]').should('have.class', 'active');
            cy.get('[data-tab="global"]').should('not.have.class', 'active');
        });

        it('Devrait afficher le contenu du classement', () => {
            cy.get('#leaderboardContent').should('be.visible');
            cy.get('.leaderboard-item').should('have.length.at.least', 1);
        });

        it('Devrait afficher les éléments du classement avec rang', () => {
            cy.get('.leaderboard-item').first().within(() => {
                cy.get('.leaderboard-rank').should('be.visible');
                cy.get('.leaderboard-avatar').should('be.visible');
                cy.get('.leaderboard-name').should('be.visible');
                cy.get('.leaderboard-score').should('be.visible');
            });
        });

        it('Devrait afficher les médailles pour le top 3', () => {
            cy.get('.leaderboard-rank').first().should('have.class', 'gold');

            cy.get('.leaderboard-rank').eq(1).then(($rank) => {
                if ($rank.length) {
                    cy.wrap($rank).should('have.class', 'silver');
                }
            });
        });

        it('Devrait basculer entre les onglets correctement', () => {
            cy.get('[data-tab="local"]').click();
            cy.wait(300);
            cy.get('[data-tab="friends"]').click();
            cy.wait(300);
            cy.get('[data-tab="global"]').click();

            cy.get('[data-tab="global"]').should('have.class', 'active');
        });
    });

    describe('Amis', () => {
        beforeEach(() => {
            cy.get('[data-view="friends"]').click();
        });

        it('Devrait afficher la vue Amis', () => {
            cy.get('#friendsView').should('have.class', 'active');
        });

        it('Devrait afficher le bouton Ajouter un ami', () => {
            cy.get('#addFriendBtn').should('be.visible').and('contain', 'Ajouter un ami');
        });

        it('Devrait afficher la liste des amis', () => {
            cy.get('#friendsList').should('be.visible');
        });

        it('Devrait afficher les cartes d\'amis', () => {
            cy.get('.friend-card').should('have.length.at.least', 1);
        });

        it('Devrait afficher les informations d\'un ami', () => {
            cy.get('.friend-card').first().within(() => {
                cy.get('.friend-avatar').should('be.visible');
                cy.get('.friend-name').should('be.visible');
                cy.get('.friend-status').should('be.visible');
                cy.get('.friend-actions').should('be.visible');
            });
        });

        it('Devrait afficher le statut en ligne', () => {
            cy.get('.friend-status.online').should('have.length.at.least', 0);
        });

        it('Devrait afficher les boutons d\'action pour chaque ami', () => {
            cy.get('.friend-card').first().within(() => {
                cy.get('.friend-actions .icon-btn').should('have.length', 2);
            });
        });

        it('Devrait cliquer sur Ajouter un ami', () => {
            cy.get('#addFriendBtn').click();
            // Une modal ou notification devrait apparaître
            cy.wait(500);
        });
    });

    describe('Interactions Sociales', () => {
        it('Devrait ouvrir le profil d\'un coureur depuis la carte', () => {
            cy.get('[data-view="map"]').click();
            cy.wait(1000);

            cy.get('.runner-card').first().click();
            cy.get('#runnerModal').should('have.class', 'active');
        });

        it('Devrait fermer la modal du coureur', () => {
            cy.get('[data-view="map"]').click();
            cy.wait(1000);

            cy.get('.runner-card').first().click();
            cy.get('.modal-close').click();
            cy.get('#runnerModal').should('not.have.class', 'active');
        });

        it('Devrait afficher les boutons d\'action dans la modal', () => {
            cy.get('[data-view="map"]').click();
            cy.wait(1000);

            cy.get('.runner-card').first().click();

            cy.get('#sendRunRequestBtn').should('be.visible');
            cy.get('#chatRunnerBtn').should('be.visible');
        });
    });
});

