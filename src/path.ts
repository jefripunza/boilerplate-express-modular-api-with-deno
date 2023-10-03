import * as path from "https://deno.land/std@0.202.0/path/mod.ts";

export const project_root = Deno.cwd();
export const __filename = new URL("", import.meta.url).pathname;

// Directory
const apps_dir = path.join(project_root, "src/apps");
const contracts_dir = path.join(project_root, "src/contracts");
const helpers_dir = path.join(project_root, "src/helpers");
const middlewares_dir = path.join(project_root, "src/middlewares");
const tests_dir = path.join(project_root, "tests");

// usable
export const modules_dir = path.join(project_root, "src/modules");

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
  tests_dir,

  modules_dir,

  user_dir,
  product_dir,
  logo_dir,

  strict_dir,
];

for (const dir of directories) {
  try {
    if (!Deno.statSync(dir).isDirectory) {
      Deno.mkdirSync(dir, { recursive: true });
    }
  } catch (_error) {
    Deno.mkdirSync(dir, { recursive: true });
  }
}

// File
export const app_file = path.join(project_root, "run");
export const swagger_json_file = path.join(project_root, "swagger.json");
export const swagger_json_ts_file = path.join(
  project_root,
  "src",
  "swagger_json.ts"
);
export const swagger_html_file = path.join(
  project_root,
  "assets",
  "public",
  "swagger.html"
);
