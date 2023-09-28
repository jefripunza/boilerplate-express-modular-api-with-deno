// deno-lint-ignore-file no-namespace

import { Knex as KnexInterface } from "npm:knex@2.4.2";

import { migrations_dir } from "./path.ts";
import { Database, Server } from "./env.ts";

export namespace Knex {
  export const config: KnexInterface.Config = {
    client: Database.TYPE,
    connection: {
      host: Database.HOST,
      port: Database.PORT,
      user: Database.USER,
      password: Database.PASS,
      database: Database.NAME,
    },
    pool: {
      min: Database.poolMin,
      max: Database.poolMax,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: migrations_dir,
    },
    debug: Server.isLocal ? true : false,
  };
}

export namespace FileUploader {
  export const max_file_upload_size = 100; // MB
  export const max_upload_image = 3; // MB
  export const allow_file_extension_image = [".jpg", ".jpeg", ".png"];
}

export const user_roles = {
  // developer
  superadmin: "superadmin",

  // administrator
  admin: "admin",

  // user
  basic: "basic", // register
};

export const tables = {
  blocks: "blocks",
  settings: "settings",
  users: "users",
  user_address: "user_address", // users: one to many
  histories: "histories",
};
