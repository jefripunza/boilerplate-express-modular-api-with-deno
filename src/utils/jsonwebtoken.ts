import { Status } from "https://deno.land/x/opine@2.3.4/deps.ts";

// @deno-types="npm:@types/jsonwebtoken@9.0.2"
import jwt from "npm:jsonwebtoken@9.0.0";
// @deno-types="npm:@types/uuid@9.0.0"
import { v4 as uuidv4 } from "npm:uuid@9.0.0";

import { Jwt } from "../env.ts";
import { ITokenContent } from "../contracts/request.contract.ts";

export const createToken = (object: object) => {
  const jwtid = uuidv4();
  return {
    token: jwt.sign(object, Jwt.SECRET_TOKEN, {
      expiresIn: Jwt.EXPIRED_TOKEN,
      jwtid,
    }),
    jwtid,
  };
};

export const getJwtId = (token: string) => {
  const decode = jwt.decode(token, {
    complete: true,
  });
  if (!decode) {
    return false;
  }
  const custom_decode: any = decode;
  return custom_decode.payload.jti;
};

interface IJwtExtract {
  exp: number;
}
export interface IJwtData extends ITokenContent, IJwtExtract {}

interface IVerifyToken {
  data: IJwtData;
  error?: number;
  message?: string;
}
export const verifyToken = async (token: string): Promise<IVerifyToken> => {
  return await new Promise((resolve) => {
    jwt.verify(token, Jwt.SECRET_TOKEN, (err, data: any) => {
      if (err) {
        resolve({
          error: Status.Unauthorized,
          message: "Not Authorized",
          data,
        });
      }
      resolve({
        data,
      });
    });
  });
};
