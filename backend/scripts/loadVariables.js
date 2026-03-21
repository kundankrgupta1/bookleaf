//api-gateway/scripts/loadVariables.js
import dotenv from 'dotenv';
import fs from 'fs';

const envFilePath = '.env';

if (!fs.existsSync(envFilePath)) {
    console.error('⚠️ Missing ".env" File. Application Can Not Start!');
    process.exit(1);
}

dotenv.config();

const requiredEnvVars = [
    "NODE_ENV", "PORT", "HOST",
    "APPLICATION_NAME"
];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
    console.error(`⚠️ Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
}