/// <reference types="cypress" />

describe('📱 Responsive Design', () => {
    const viewports = [
        { name: 'Desktop', width: 1920, height: 1080 },
        { name: 'Laptop', width: 1366, height: 768 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Mobile', width: 375, height: 667 }
    ];

    viewports.forEach(({ name, width, height }) => {
        describe(`${name} (${width}x${height})`, () => {
            beforeEach(() => {
                cy.viewport(width, height);
                cy.visit('/');
                cy.wait(500);
            });

            it('Devrait charger correctement', () => {
                cy.get('.navbar').should('be.visible');
                cy.get('.sidebar').should('exist');
                cy.get('.content-area').should('be.visible');
            });

            it('Devrait afficher le logo', () => {
                cy.get('.nav-logo').should('be.visible');
            });

            it('Devrait afficher les statistiques utilisateur', () => {
                cy.get('#userCoins').should('be.visible');
                cy.get('#userLevel').should('be.visible');
            });

            if (width >= 768) {
                it('Devrait afficher la sidebar', () => {
                    cy.get('.sidebar').should('be.visible');
                });

                it('Devrait naviguer entre les vues', () => {
                    cy.get('[data-view="challenges"]').click();
                    cy.get('#challengesView').should('have.class', 'active');
                });
            }

            if (width < 768) {
                it('Devrait adapter la mise en page pour mobile', () => {
                    cy.get('.main-container').should('have.css', 'grid-template-columns');
                });
            }

            it('Devrait ouvrir le planificateur d\'itinéraire', () => {
                cy.get('[data-view="map"]').click();
                cy.wait(500);
                cy.get('#planRouteBtn').click();
                cy.get('#routePlanningPanel').should('be.visible');
            });

            if (width < 768) {
                it('Devrait afficher le panneau d\'itinéraire en pleine largeur', () => {
                    cy.get('[data-view="map"]').click();
                    cy.get('#planRouteBtn').click();

                    cy.get('#routePlanningPanel').should('have.css', 'width').then((w) => {
                        const widthValue = parseFloat(w);
                        const viewportWidth = width;
                        expect(widthValue / viewportWidth).to.be.greaterThan(0.9);
                    });
                });
            }

            it('Devrait afficher les notifications', () => {
                cy.window().then((win) => {
                    win.showNotification('Test responsive', 'info');
                });
                cy.get('.notification-toast').should('be.visible');
            });
        });
    });
});

