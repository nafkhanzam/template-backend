import {log} from "@nafkhanzam/backend-utils";
import dotenv from "dotenv-flow";

export const env = {
  DATABASE_URL: "",
  JWT_LOGIN_KEY: "JWT_LOGIN_KEY",
  NODE_ENV: "development",
  PORT: "4000",
  BASE_URL: "http://localhost:4000",
  BACKBLAZE_B2_KEY_ID: "",
  BACKBLAZE_B2_KEY: "",
  BACKBLAZE_B2_REGION: "",
  BACKBLAZE_B2_BUCKET_NAME: "geothermal-dev",
};

const PRODUCTION = "production";
const TEST = "test";

type KeyType = keyof typeof env;

dotenv.config({purge_dotenv: true});

function validKey(key: string): key is KeyType {
  return key in env;
}

for (const [key, value] of Object.entries(process.env)) {
  if (validKey(key) && value !== null && value !== undefined) {
    env[key] = value;
  }
}

for (const [key, value] of Object.entries(env)) {
  if (!value) {
    log.warn(`🛑 Environment variable ${key} is empty!`);
  } else if (!isProduction()) {
    log.debug(`${key}: ${value}`);
  }
}

export function isProduction() {
  return env.NODE_ENV?.toLowerCase() === PRODUCTION;
}

export function isTest() {
  return env.NODE_ENV?.toLowerCase() === TEST;
}

export function isDevelopment() {
  return !isProduction() && !isTest();
}
