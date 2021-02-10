import {log} from "@nafkhanzam/backend-utils";
import dotenv from "dotenv-flow";

const keys = [
  "DATABASE_URL",
  "JWT_LOGIN_KEY",
  "NODE_ENV",
  "PORT",
  "REDIS_HOST_PORT",
] as const;

const PRODUCTION = "production";
const TEST = "test";

type Env = {
  [key in typeof keys[number]]: string;
};

export function isProduction() {
  return env.NODE_ENV?.toLowerCase() === PRODUCTION;
}

export function isTest() {
  return env.NODE_ENV?.toLowerCase() === TEST;
}

export function isDevelopment() {
  return !isProduction() && !isTest();
}

dotenv.config({purge_dotenv: true});
export const env = Object.fromEntries(
  Object.keys(process.env).map((key) => [key, process.env[key] ?? ""]),
) as Env;
for (const key of keys) {
  const value = env[key];
  if (!value) {
    log.warn(`🛑 Environment variable ${key} is empty!`);
  } else if (!isProduction()) {
    log.debug(`${key}: ${value}`);
  }
}
