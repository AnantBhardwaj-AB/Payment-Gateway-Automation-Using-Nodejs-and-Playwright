import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

global.self = global;

if (!global.crypto) {
    Object.defineProperty(global, 'crypto', {
        value: nodeCrypto,
        configurable: true,
        enumerable: true,
        writable: true
    });
}
// --- 2. MANUALLY LOAD THE HELPER ---
const require = createRequire(import.meta.url);
const { api: helperApi } = require('../dashboard/helper.js');

// --- DEFINE __dirname FOR ES MODULES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const metadataPath = path.resolve(__dirname, '../automation/data/api-metadata.json');
const rootDir = path.resolve(__dirname, '..');
const libPath = path.resolve(rootDir, 'automation/lib/*');
const javaBridgePath = path.resolve(rootDir, 'automation/bridge/java');
const LANG = process.env.SDK_LANG || 'java';

// --- UPDATED FOLDER LOGIC ---
const apiDataDir = path.join(rootDir, 'automation', 'data', 'Api');

// 1. Read all .json files from the directory
const apiFiles = fs.readdirSync(apiDataDir).filter(file => file.endsWith('.json'));

function resolveData(payload) {
    if (typeof payload !== 'object' || payload === null) {
        // If it's a string, check if it exists in helper.js
        if (typeof payload === 'string' && helperApi.hasOwnProperty(payload)) {
            return helperApi[payload];
        }
        return payload;
    }

    if (Array.isArray(payload)) {
        return payload.map(item => resolveData(item));
    }

    const processed = {};
    for (const key in payload) {
        const value = payload[key];

        // Check for nested objects or arrays
        if (typeof value === 'object' && value !== null) {
            processed[key] = resolveData(value);
        }
        // Check if the string value matches a variable name in helper.js
        else if (typeof value === 'string' && helperApi.hasOwnProperty(value)) {
            processed[key] = helperApi[value];
        }
        else {
            processed[key] = value;
        }
    }
    return processed;
}

const Validators = {
    // Strategy for: { status: "Successful" }
    MATCH_VALUE: (response, config) => {
        expect(response[config.expectedField]).toBe(config.expectedValue);
    },
    // Strategy for: { GLOBAL: { ... } }
    CONTAINS_KEY: (response, config) => {
        expect(response).toHaveProperty(config.expectedField);
    },
    // Strategy for: [ {id: 1}, {id: 2} ]
    ARRAY_NOT_EMPTY: (response, config) => {
        const data = config.expectedField ? response[config.expectedField] : response;
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
    },
    // Default fallback
    DEFAULT: (response) => {
        expect(response).toBeDefined();
    }
};
test.describe(`SDK Regression: ${LANG.toUpperCase()}`, () => {

    // FIXED: Changed from looping keys of apiDefinitions to looping filenames directly
    for (const fileName of apiFiles) {

        // FIXED: Read the file content INSIDE the loop to handle multiple APIs per file
        const filePath = path.join(apiDataDir, fileName);
        const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // FIXED: Added a second loop to iterate through every API key INSIDE the JSON file
        for (const apiName of Object.keys(fileContent)) {

            test(`Validate ${apiName} (from ${fileName})`, async () => {
                // FIXED: apiConfig now correctly points to the specific API data (e.g. PLUGIN_DETAILS)
                const apiConfig = fileContent[apiName];

                // FIXED: Added safety check to prevent "TypeError: Received undefined"
                if (!apiConfig || !apiConfig.payload) {
                    throw new Error(`❌ API "${apiName}" in ${fileName} is missing the "payload" key.`);
                }

                // FIXED: Call resolveData here to swap "transactionAmount" with 10.00
                const finalPayload = resolveData(apiConfig.payload);

                const tempPath = path.resolve(rootDir, `automation/data/temp/${apiName}.json`);

                fs.mkdirSync(path.dirname(tempPath), { recursive: true });
                // FIXED: Now correctly stringifies the nested payload
                fs.writeFileSync(tempPath, JSON.stringify(finalPayload, null, 2));

                let command = '';
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
                    const rawOutput = execSync(command).toString().trim();

                    const jsonStart = rawOutput.indexOf('{');
                    const jsonEnd = rawOutput.lastIndexOf('}') + 1;

                    if (jsonStart === -1) throw new Error(`No JSON found in output: ${rawOutput}`);

                    const cleanOutput = rawOutput.substring(jsonStart, jsonEnd);
                    const response = JSON.parse(cleanOutput);

                    console.log(`✅ ${apiName} Response:`, response);

                    const strategy = apiConfig.validationStrategy || 'DEFAULT';
                    const validate = Validators[strategy] || Validators.DEFAULT;

                    validate(response, apiConfig);

                    console.log(`⭐ ${apiName} validated using ${strategy}`);
                } catch (e) {
                    throw new Error(`Execution failed: ${e.stdout?.toString() || e.message}`);
                }
            });
        }
    }
});