import SwagInit from "npm:swagger-autogen@2.23.1";

import { Swagger, Server } from "./env.ts";
import { modules_dir, swagger_json_file } from "./path.ts";

const swaggerAutogen = SwagInit();

const doc = {
  info: {
    title: Swagger.APP_NAME,
    version: Swagger.APP_VERSION,
    description: Swagger.APP_DESCRIPTION,
    termsOfService: "http://swagger.io/terms/",
    contact: {
      name: Swagger.CONTACT_NAME,
      email: Swagger.CONTACT_EMAIL,
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  host: `localhost:${Server.PORT}`,
  basePath: "/",
  schemes: Swagger.APP_SCHEMES,
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    // {
    //   name: "Auth",
    // },
  ],
  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description:
        "Enter your bearer token in the format **Bearer &lt;token>**",
    },
  },
  definitions: {
    only_message: {
      message: "string",
    },
  },
  components: {}, // by default: empty object (OpenAPI 3.x)
};

const endpointsFiles = [...Deno.readDirSync(modules_dir)]
  .filter((dirEntry) => !dirEntry.name.startsWith("#") && !dirEntry.isFile)
  .map(
    (dirEntry) => `${modules_dir}/${dirEntry.name}/${dirEntry.name}.router.ts`
  )
  .filter((dir_path) => {
    try {
      return Deno.statSync(dir_path).isFile;
    } catch (error) {
      return false;
    }
  });

await swaggerAutogen(swagger_json_file, endpointsFiles, doc);
