// @deno-types="npm:@types/express@4"
import { Request } from "npm:express@4.18.2";

export interface ITokenContent {
  id: string;
  role: string;
  jti: string;
}

interface IReqUser {
  headers: {
    authorization: string;
    "api-key": string;
  };
  user: ITokenContent;
  ip_address: string;
}
export interface IRequestJoin extends Request, IReqUser {}
