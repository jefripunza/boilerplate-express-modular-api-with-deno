import * as path from "https://deno.land/std@0.202.0/path/mod.ts";

export const project_root = Deno.cwd();

// Directory
const apps_dir = path.join(project_root, "src/apps");
const contracts_dir = path.join(project_root, "src/contracts");
const helpers_dir = path.join(project_root, "src/helpers");
const middlewares_dir = path.join(project_root, "src/middlewares");
const repositories_dir = path.join(project_root, "src/models/repositories");
const tests_dir = path.join(project_root, "tests");

// usable
export const modules_dir = path.join(project_root, "src/modules");
export const migrations_dir = path.join(project_root, `src/models/migrations`);
export const seeds_dir = path.join(project_root, `src/models/seeds`);

// public
export const public_dir = path.join(project_root, `assets/public`);
export const user_dir = path.join(public_dir, `image/user`);
export const product_dir = path.join(public_dir, `image/product`);
export const logo_dir = path.join(public_dir, `image/logo`);

// strict
export const strict_dir = path.join(project_root, `assets/strict`);

// make directory
const directories = [
  apps_dir,
  contracts_dir,
  helpers_dir,
  middlewares_dir,
  repositories_dir,
  tests_dir,
  migrations_dir,
  seeds_dir,
  user_dir,
  product_dir,
  logo_dir,
];

for (const dir of directories) {
  try {
    if (!Deno.statSync(dir).isDirectory) {
      Deno.mkdirSync(dir, { recursive: true });
    }
  } catch (error) {
    Deno.mkdirSync(dir, { recursive: true });
  }
}

// File
export const swagger_json_file = `${project_root}/swagger.json`;
