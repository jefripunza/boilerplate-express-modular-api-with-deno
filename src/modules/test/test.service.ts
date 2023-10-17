// deno-lint-ignore-file ban-ts-comment

import {
  NextFunction,
  OpineRequest,
  OpineResponse,
} from "https://deno.land/x/opine@2.3.4/mod.ts";
import { Status } from "https://deno.land/x/opine@2.3.4/deps.ts";

import * as DTO from "../../dto.ts";

import { getClient } from "https://deno.land/x/grpc_basic@0.4.7/client.ts";
import { Greeter } from "../../../proto/greeter.d.ts";

const protoGreeterPath = new URL(
  "../../../proto/greeter.proto",
  import.meta.url
);
const protoGreeterFile = await Deno.readTextFile(protoGreeterPath);

class TestService {
  async grpcTestNewsService() {
    try {
      const client = getClient<Greeter>({
        port: 50051,
        root: protoGreeterFile,
        serviceName: "Greeter",
      });

      /* unary calls */
      console.log(await client.SayHello({ name: "unary #1" }));
      console.log(await client.SayHello({ name: "unary #2" }));

      /* server stream */
      for await (const reply of client.ShoutHello({ name: "streamed" })) {
        console.log(reply);
      }

      client.close();
      return DTO.successResponse({
        data: {},
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("test.grpcTestNewsService", error);
    }
  }
}

export default new TestService();
