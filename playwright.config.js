import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 1. Where the test files are located
  testDir: './tests',

  // 2. Look for our specific regression file
  testMatch: /.*\.spec\.js/,

  // 3. Fail the entire suite if one test fails (optional, good for debugging)
  fullyParallel: false,
  workers: 1, 

  // 4. Output format in the terminal
  reporter: 'list',

  // 5. Global settings
  use: {
    // We are testing SDKs/APIs, so we don't need a browser window
    headless: false,
    // Capture details only if a test fails
    trace: 'on-first-retry',
  },

  // Remove all 'projects', 'webServers', and 'devices' from here
});