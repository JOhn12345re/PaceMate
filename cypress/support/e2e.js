// ***********************************************************
// This file is processed and loaded automatically before test files.
// ***********************************************************

import './commands';

// Disable uncaught exception handling
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    // Useful for external libraries errors that we can't control
    if (err.message.includes('ResizeObserver')) {
        return false;
    }
    if (err.message.includes('Leaflet')) {
        return false;
    }
    return true;
});

// Set default timeouts
Cypress.config('defaultCommandTimeout', 10000);
Cypress.config('pageLoadTimeout', 30000);

// Before each test
beforeEach(() => {
    // Stub console methods to avoid noise
    cy.window().then((win) => {
        cy.stub(win.console, 'log');
        cy.stub(win.console, 'warn');
    });
});

// After each test
afterEach(() => {
    // Take screenshot on failure
    cy.screenshot({ capture: 'runner', overwrite: true });
});

// Helper to wait for app initialization
Cypress.Commands.add('waitForAppInit', () => {
    cy.window().then((win) => {
        return new Cypress.Promise((resolve) => {
            const checkInit = () => {
                if (win.APP_STATE && win.APP_STATE.initialized) {
                    resolve();
                } else {
                    setTimeout(checkInit, 100);
                }
            };
            checkInit();
        });
    });
});

// Global configuration
Cypress.Screenshot.defaults({
    screenshotOnRunFailure: true,
    capture: 'viewport',
    overwrite: true
});

