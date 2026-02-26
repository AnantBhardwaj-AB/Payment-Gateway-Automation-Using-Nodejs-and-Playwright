const { execSync } = require('child_process');

// 1. Define exact paths to your SDK folders
const Base_DIR = '/home/anant/Documents/Wrappers/wrapper-implementation';
const goBin = '/usr/local/go/bin/go';

const projects = {
    go: `${Base_DIR}/Golang_wrapper_integration-test/API_Integration`,
    node: `${Base_DIR}/Node.js_wrapper_integration-test`,
    python: `${Base_DIR}/Python_wrapper_integration_test`,
    php: `${Base_DIR}/php_wrapper_integration_test`,
    ruby: `${Base_DIR}/ruby_wrapper_integration_test`,
    java: `${Base_DIR}/Java_wrapper_integration_test`,
    dotnet: `${Base_DIR}/Dotnet-core_wrapper_integration_test`,
    csharp: `${Base_DIR}/Csharp_wrapper_integration_test`
};

// 2. Helper function to run commands safely
const runUpdate = (name, path, command) => {
    try {
        console.log(`\n--- 🔄 Updating ${name} SDK ---`);
        console.log(`📂 Path: ${path}`);
        // timeout: 120000 (2 minutes) to allow for slow downloads
        execSync(`cd "${path}" && ${command}`, { stdio: 'inherit', timeout: 120000 });
        console.log(`✅ ${name} update complete.`);
    } catch (err) {
        console.error(`❌ Failed to update ${name}: ${err.message}`);
    }
};

console.log("🚀 Starting Global SDK Update Sequence...");

// --- EXECUTION STEPS ---

// 1. GO
runUpdate("Go", projects.go, `${goBin} mod tidy`);

// 2. NODE
runUpdate("Node", projects.node, `npm install`);

// 3. PYTHON
runUpdate("Python", projects.python, `pip install -r requirements.txt --upgrade`);

// 4. PHP
runUpdate("PHP", projects.php, `composer update --ignore-platform-reqs`);
// 5. RUBY
runUpdate("Ruby", projects.ruby, `bundle update`);

// 6. JAVA
runUpdate("Java", projects.java, `mvn clean compile -U`);

// 7. DOTNET
runUpdate("Dotnet", projects.dotnet, `dotnet restore`);

// 8. C#
runUpdate("C#", projects.csharp, `dotnet restore`);

console.log("\n✨ [FINISHED] All SDK updates attempted.");