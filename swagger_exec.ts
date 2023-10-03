import { swagger_json_ts_file } from "./src/path.ts";
import { fileExist } from "./src/helpers/fs.ts";
import { createSwaggerJson } from "./src/swagger.ts";

const swagger_json = await createSwaggerJson();

if (await fileExist(swagger_json_ts_file)) {
  await Deno.remove(swagger_json_ts_file, { recursive: true });
}
await Deno.writeTextFile(
  swagger_json_ts_file,
  `export const swagger_json_cache = JSON.parse(\`${JSON.stringify(swagger_json)}\`);`
);
