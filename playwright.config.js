import { defineConfig, devices } from '@playwright/test';
import { stdout } from 'node:process';

const GO_BIN = '/usr/local/go/bin/go';
const Base_DIR = '/home/anant/Documents/Wrappers/wrapper-implementation';


/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !false,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [

    // 1. GO-SDK 
    {
      name: 'Go-SDK',
      testMatch: /.*go.*\.spec\.js/,
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4000' },
      webServer: {
        command: `cd ${Base_DIR}/Golang_wrapper_integration-test/API_Integration && ${GO_BIN} run main.go`,
        url: 'http://localhost:4000',
        reuseExistingServer: false,
        stdout: 'pipe',
        stderr: 'pipe',
      },
    },

    // 2. PHP-SDK
    {
      name: 'PHP_SDK',
      testMatch: /.*php.*\.spec\.js/,
      use: { ...devices['Desktop Firefox'], baseURL: 'http://localhost:8080' },
      webServer: {
        command: `cd ${Base_DIR}/php_wrapper_integration_test && php -S localhost:8080`,
        url: 'http://localhost:8080',
        reuseExistingServer: false,
        stdout: 'pipe',
        stderr: 'pipe',
      },
    },

    // 3. PYTHON-SDK
    {
      name: 'PYTHON_SDK',
      testMatch: /.*python.*\.spec\.js/,
      use: { ...devices['Desktop Firefox'], baseURL: 'http://localhost:5000' },
      webServer: {
        command: `cd ${Base_DIR}/Python_wrapper_integration_test && python3 app.py`,
        url: 'http://localhost:5000',
        reuseExistingServer: false,
        stdout: 'pipe',
        stderr: 'pipe',
      },
    },

    // 4. Node.JS-SDK
    {
      name: 'NODE_SDK',
      testMatch: /.*node.*\.spec\.js/,
      use: { ...devices['Desktop Firefox'], baseURL: 'http://localhost:3000' },
      webServer: {
        command: `cd ${Base_DIR}/Node.js_wrapper_integration-test && npm start`,
        url: 'http://localhost:3000',
        reuseExistingServer: false,
        stdout: 'pipe',
        stderr: 'pipe',
      },
    },

    // 5. Ruby-SDK
    {
      name: 'RUBY_SDK',
      testMatch: /.*ruby.*\.spec\.js/,
      use: { ...devices['Desktop Firefox'], baseURL: 'http://localhost:3000' },
      webServer: {
        command: `cd ${Base_DIR}/ruby_wrapper_integration_test && rails s`,
        url: 'http://localhost:3000',
        reuseExistingServer: false,
        stdout: 'pipe',
        stderr: 'pipe',
      },
    },

    // 6. Dotnet-SDK
    {
      name: 'Dotnet_SDK',
      testMatch: /.*dotnet.*\.spec\.js/,
      use: { ...devices['Desktop Firefox'], baseURL: 'http://localhost:3000' },
      webServer: {
        command: `cd ${Base_DIR}/Dotnet-core_wrapper_integration_test && dotnet run`,
        url: 'http://localhost:3000',
        reuseExistingServer: false,
        stdout: 'pipe',
        stderr: 'pipe',
      },
    },

    // 7. C#-SDK
    {
      name: 'C-sharp_SDK',
      testMatch: /.*csharp.*\.spec\.js/,
      use: { ...devices['Desktop Firefox'], baseURL: 'http://localhost:3000' },
      webServer: {
        command: `cd ${Base_DIR}/Csharp_wrapper_integration_test/Integration_test/ && dotnet run`,
        url: 'http://localhost:3000',
        reuseExistingServer: false,
        stdout: 'pipe',
        stderr: 'pipe',
      },
    },

    // 8. JAVA-SDK
    {
      name: 'JAVA_SDK',
      testMatch: /.*java.*\.spec\.js/,
      use: { ...devices['Desktop Firefox'], baseURL: 'http://127.0.0.1:8000' },
      webServer: {
        command: 'cd /home/anant/Documents/Wrappers/wrapper-implementation/Java_wrapper_integration_test && ./mvnw spring-boot:run',
        url: 'http://127.0.0.1:8000',
        reuseExistingServer: false,
        stdout: 'inherit',
        stderr: 'inherit',
        timeout: 60000, 
      },
    },


    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
 });

