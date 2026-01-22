const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:8000',
        viewportWidth: 1920,
        viewportHeight: 1080,
        video: true,
        screenshotOnRunFailure: true,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        }
    },
    component: {
        devServer: {
            framework: 'vanilla',
            bundler: 'webpack'
        }
    }
});

