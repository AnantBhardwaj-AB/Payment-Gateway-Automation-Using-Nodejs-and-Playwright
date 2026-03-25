import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- DEFINE __dirname FOR ES MODULES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const metadataPath = path.resolve(__dirname, '../automation/data/api-metadata.json');
const rootDir = path.resolve(__dirname, '..');
const metadataPath = path.join(rootDir, 'automation', 'data', 'api-metadata.json');
const libPath = path.resolve(__dirname, '../automation/lib/*');
const javaBridgePath = path.resolve(__dirname, '../automation/bridge/java');
const apiDefinitions = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
console.log("Found APIs:", Object.keys(apiDefinitions));
const LANG = process.env.SDK_LANG || 'java'; 

test.describe(`SDK Regression: ${LANG.toUpperCase()}`, () => {

    for (const apiName of Object.keys(apiDefinitions)) {
        
        test(`Validate ${apiName}`, async () => {
            const testData = apiDefinitions[apiName].payload;
            
            // Create a temp file for the large JSON
            const tempPath = path.resolve(__dirname, `../automation/data/temp/${apiName}.json`);
            fs.writeFileSync(tempPath, JSON.stringify(testData));

            let command = '';

            // 2. The Command Factory
            if (LANG === 'java') {
                command = `java -cp "${libPath}:${javaBridgePath}:." SDKBridge "${apiName}" "${tempPath}"`;
            } 
            else if (LANG === 'php') {
                command = `php automation/bridge/php/bridge.php "${apiName}" "${tempPath}"`;
            }
            else if (LANG === 'node') {
                command = `node automation/bridge/node/bridge.js "${apiName}" "${tempPath}"`;
            }

            try {
                const output = execSync(command).toString();
                console.log("output....", output);
                const response = JSON.parse(output);
                
                console.log(`${apiName} Result:`, response);
                expect(response.status).toBe(apiDefinitions[apiName].expectedStatus);
            } catch (e) {
                throw new Error(`Execution failed: ${e.stdout?.toString() || e.message}`);
            }
        });
    }
});