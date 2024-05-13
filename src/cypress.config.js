const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    REACT_CYPRESS_LOCAL_TEST_URL: "http://localhost:3000",
    REACT_CYPRESS_STAGING_TEST_URL: "https://sparkledev.online"
  }
});
