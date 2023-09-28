// deno-lint-ignore-file no-namespace

import { fileExist } from "./helpers/fs.ts";

// ==================================================================== //
// ==================================================================== //
//-> Read .env

const isEnvExist = await fileExist(".env");
if (isEnvExist) {
  const data = await Deno.readTextFile(".env");
  for (const line of data.split("\n")) {
    const [key, value] = line.split("=");
    if (key && value) Deno.env.set(key.trim(), value.trim());
  }
}

// ==================================================================== //
// ==================================================================== //

export const ENV = Deno.env.get("ENV") || "local";

export namespace Server {
  export const SECRET_KEY = Deno.env.get("SECRET_KEY") || "high-secret-key";
  export const isProduction = String(ENV).includes("production");
  export const isDevelopment = String(ENV).includes("development");
  export const isLocal = ![isDevelopment, isProduction].includes(true);
  export const PORT = Number(Deno.env.get("PORT") || "8080");
  export const TZ = Deno.env.get("TZ") || "Asia/Jakarta";
}

export namespace Swagger {
  export const APP_NAME = Deno.env.get("APP_NAME") || "app name";
  export const APP_VERSION = Deno.env.get("APP_VERSION") || "1.0.0";
  export const APP_DESCRIPTION = Deno.env.get("APP_DESCRIPTION") ||
    "please complete information in .env";
  export const APP_SCHEMES = Deno.env.get("APP_SCHEMES")
    ? String(Deno.env.get("APP_SCHEMES")).toLowerCase().split("|")
    : ["http", "https"];
  export const CONTACT_NAME = Deno.env.get("CONTACT_NAME");
  export const CONTACT_EMAIL = Deno.env.get("CONTACT_EMAIL");
}

export namespace Database {
  export const TYPE = Deno.env.get("DB_TYPE") || "mysql2";
  export const HOST = Deno.env.get("DB_HOST") || "localhost";
  export const PORT = Number(Deno.env.get("DB_PORT") || 3306);
  export const USER = Deno.env.get("DB_USER") || "root";
  export const PASS = Deno.env.get("DB_PASS") || "";
  export const NAME = Deno.env.get("DB_NAME") || "test";
  export const poolMin = Number(Deno.env.get("DB_POOL_MIN") || 0);
  export const poolMax = Number(Deno.env.get("DB_POOL_MAX") || 10);
}

export namespace Mongo {
  export const url = Deno.env.get("MONGO_URL") || "mongodb://localhost:27017";
}

export const OTP_EXPIRED_MINUTE = Number(
  Deno.env.get("OTP_EXPIRED_MINUTE") || 3,
);

export namespace Jwt {
  export const SECRET_TOKEN = Deno.env.get("JWT_SECRET_TOKEN") ||
    "very-secret-token";
  export const EXPIRED_TOKEN = Deno.env.get("JWT_EXPIRED_TOKEN") || "7d";
}

export namespace Reporter {
  export const GIT_URL: any = Deno.env.get("REPORT_GIT_URL");
  export const ERROR_URL: any = Deno.env.get("REPORT_ERROR_URL");
  export const BUSINESS_URL: any = Deno.env.get("REPORT_BUSINESS_URL");
  export const BEARER_TOKEN = Deno.env.get("REPORT_BEARER_TOKEN");
  export const GROUP_ID = Deno.env.get("REPORT_GROUP_ID");
}
