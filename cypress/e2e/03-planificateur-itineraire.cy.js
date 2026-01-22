/// <reference types="cypress" />

describe('🧭 Planificateur d\'Itinéraire', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('[data-view="map"]').click();
        cy.wait(1000);
    });

    it('Devrait ouvrir le panneau de planification', () => {
        cy.get('#planRouteBtn').click();
        cy.get('#routePlanningPanel').should('be.visible');
        cy.get('.route-panel-header h3').should('contain', 'Planification d\'Itinéraire');
    });

    it('Devrait afficher les champs de saisie des points', () => {
        cy.get('#planRouteBtn').click();

        cy.get('#startPoint').should('be.visible');
        cy.get('#endPoint').should('be.visible');
    });

    it('Devrait avoir un point de départ par défaut', () => {
        cy.get('#planRouteBtn').click();
        cy.get('#startPoint').should('have.value').and('not.be.empty');
    });

    it('Devrait fermer le panneau de planification', () => {
        cy.get('#planRouteBtn').click();
        cy.get('.route-panel-header .close-btn').click();
        cy.get('#routePlanningPanel').should('not.be.visible');
    });

    it('Devrait ajouter une étape intermédiaire', () => {
        cy.get('#planRouteBtn').click();

        cy.get('.route-options .btn-secondary').contains('Ajouter étape').click();
        cy.get('.waypoints-container .waypoint-step').should('have.length', 1);

        cy.get('.route-options .btn-secondary').contains('Ajouter étape').click();
        cy.get('.waypoints-container .waypoint-step').should('have.length', 2);
    });

    it('Devrait supprimer une étape intermédiaire', () => {
        cy.get('#planRouteBtn').click();

        cy.get('.route-options .btn-secondary').contains('Ajouter étape').click();
        cy.get('.waypoints-container .waypoint-step').should('have.length', 1);

        cy.get('.remove-waypoint-btn').first().click();
        cy.get('.waypoints-container .waypoint-step').should('have.length', 0);
    });

    it('Devrait afficher les boutons de calcul et d\'options', () => {
        cy.get('#planRouteBtn').click();

        cy.get('.route-options .btn-primary').should('contain', 'Calculer l\'itinéraire');
        cy.get('.route-options .btn-secondary').should('contain', 'Ajouter étape');
    });

    it('Devrait simuler la sélection d\'un point de départ', () => {
        cy.get('#planRouteBtn').click();

        cy.get('.step-btn').contains('Choisir sur la carte').first().should('be.visible');
        cy.get('.step-btn').contains('Choisir sur la carte').first().should('have.class', 'step-btn');
    });

    it('Devrait calculer un itinéraire (simulation)', () => {
        cy.get('#planRouteBtn').click();

        // Simuler la sélection de points en définissant les valeurs
        cy.window().then((win) => {
            win.ROUTE_PLANNER.startPoint = [48.8566, 2.3522];
            win.ROUTE_PLANNER.endPoint = [48.8606, 2.3376];
        });

        cy.get('.route-options .btn-primary').click();
        cy.wait(1000);

        // Les statistiques devraient s'afficher
        cy.get('#routeInfo').should('be.visible');
    });

    it('Devrait afficher les statistiques de l\'itinéraire', () => {
        cy.get('#planRouteBtn').click();

        cy.window().then((win) => {
            win.ROUTE_PLANNER.startPoint = [48.8566, 2.3522];
            win.ROUTE_PLANNER.endPoint = [48.8606, 2.3376];
        });

        cy.get('.route-options .btn-primary').click();
        cy.wait(1000);

        cy.get('#routeDistance').should('be.visible');
        cy.get('#routeTime').should('be.visible');
        cy.get('#routePace').should('be.visible');
        cy.get('#routeCalories').should('be.visible');
    });

    it('Devrait afficher les actions d\'itinéraire', () => {
        cy.get('#planRouteBtn').click();

        cy.window().then((win) => {
            win.ROUTE_PLANNER.startPoint = [48.8566, 2.3522];
            win.ROUTE_PLANNER.endPoint = [48.8606, 2.3376];
        });

        cy.get('.route-options .btn-primary').click();
        cy.wait(1000);

        cy.get('.route-actions').should('be.visible');
        cy.get('.route-actions .btn-primary').should('contain', 'Démarrer la navigation');
        cy.get('.route-actions .btn-secondary').should('contain', 'Sauvegarder');
        cy.get('.route-actions .btn-secondary').should('contain', 'Partager');
        cy.get('.route-actions .btn-danger').should('contain', 'Effacer');
    });

    it('Devrait effacer l\'itinéraire', () => {
        cy.get('#planRouteBtn').click();

        cy.window().then((win) => {
            win.ROUTE_PLANNER.startPoint = [48.8566, 2.3522];
            win.ROUTE_PLANNER.endPoint = [48.8606, 2.3376];
        });

        cy.get('.route-options .btn-primary').click();
        cy.wait(1000);

        cy.get('.route-actions .btn-danger').click();
        cy.get('#routeInfo').should('not.be.visible');
    });

    it('Devrait sauvegarder un itinéraire', () => {
        cy.get('#planRouteBtn').click();

        cy.window().then((win) => {
            win.ROUTE_PLANNER.startPoint = [48.8566, 2.3522];
            win.ROUTE_PLANNER.endPoint = [48.8606, 2.3376];
        });

        cy.get('.route-options .btn-primary').click();
        cy.wait(1000);

        // Intercepter le prompt
        cy.window().then((win) => {
            cy.stub(win, 'prompt').returns('Mon itinéraire test');
        });

        cy.get('.route-actions .btn-secondary').contains('Sauvegarder').click();

        // Vérifier la notification
        cy.get('.notification-toast').should('contain', 'sauvegardé');
    });
});

