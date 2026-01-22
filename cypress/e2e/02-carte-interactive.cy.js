/// <reference types="cypress" />

describe('🗺️ Carte Interactive', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('[data-view="map"]').click();
        cy.wait(1000); // Attendre que Leaflet charge
    });

    it('Devrait afficher la carte Leaflet', () => {
        cy.get('#map').should('be.visible');
        cy.get('.leaflet-container').should('exist');
    });

    it('Devrait afficher les contrôles de la carte', () => {
        cy.get('#locateMe').should('be.visible').and('contain', 'Me localiser');
        cy.get('#toggleFilters').should('be.visible').and('contain', 'Filtres');
        cy.get('#toggleMapStyle').should('be.visible').and('contain', 'Style');
        cy.get('#measureDistance').should('be.visible').and('contain', 'Mesurer');
        cy.get('#showRoutes').should('be.visible').and('contain', 'Itinéraires');
        cy.get('#toggleHeatmap').should('be.visible').and('contain', 'Heatmap');
        cy.get('#fullscreenMap').should('be.visible').and('contain', 'Plein écran');
        cy.get('#planRouteBtn').should('be.visible').and('contain', 'Planifier itinéraire');
    });

    it('Devrait afficher la barre de statistiques', () => {
        cy.get('.map-stats-bar').should('be.visible');
        cy.get('#visibleRunners').should('exist');
        cy.get('#activeZone').should('exist');
        cy.get('#weatherTemp').should('exist');
        cy.get('#activityLevel').should('exist');
    });

    it('Devrait ouvrir et fermer le panneau de filtres', () => {
        cy.get('#toggleFilters').click();
        cy.get('#filtersPanel').should('have.class', 'active');

        cy.get('#distanceFilter').should('be.visible');
        cy.get('#paceFilter').should('be.visible');
        cy.get('#levelFilter').should('be.visible');
        cy.get('#availabilityFilter').should('be.visible');

        cy.get('#toggleFilters').click();
        cy.get('#filtersPanel').should('not.have.class', 'active');
    });

    it('Devrait ajuster le filtre de distance', () => {
        cy.get('#toggleFilters').click();
        cy.get('#distanceFilter').invoke('val', 25).trigger('input');
        cy.get('#distanceValue').should('contain', '25');
    });

    it('Devrait changer le style de la carte', () => {
        cy.get('#toggleMapStyle').click();
        cy.get('#mapStyleSelector').should('be.visible');

        cy.get('[data-style="dark"]').click();
        cy.wait(500);

        cy.get('[data-style="dark"]').should('have.class', 'active');
    });

    it('Devrait afficher la légende de la carte', () => {
        cy.get('#mapLegend').should('be.visible');
        cy.get('.legend-item').should('have.length', 3);
    });

    it('Devrait afficher les coureurs à proximité', () => {
        cy.get('.nearby-runners').should('be.visible');
        cy.get('#runnersCount').should('exist');
    });

    it('Devrait localiser l\'utilisateur', () => {
        cy.get('#locateMe').click();
        cy.wait(1000);
        // La notification devrait apparaître
        cy.get('.notification-toast').should('be.visible');
    });
});

