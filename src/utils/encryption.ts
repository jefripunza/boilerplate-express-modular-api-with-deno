// @deno-types="npm:@types/crypto-js@4.1.2"
import CryptoJS from "npm:crypto-js@4.1.1";
import * as base64 from "https://deno.land/std@0.203.0/encoding/base64.ts";

import { Server } from "../env.ts";
const reverse_key = String(Server.SECRET_KEY).split("").reverse().join("");

const td = new TextDecoder();

export function encode(text: string): string {
  // AES256
  const cipher = CryptoJS.AES.encrypt(text, Server.SECRET_KEY);
  const layer_1 = cipher.toString();

  // TripleDES
  const layer_2 = CryptoJS.TripleDES.encrypt(layer_1, reverse_key).toString();

  // BASE64
  const last_layer = base64.encodeBase64(layer_2);
  return last_layer;
}

export function decode(encrypted: string): string | false {
  // BASE64
  const last_layer = td.decode(base64.decodeBase64(encrypted));

  // TripleDES
  const bytes = CryptoJS.TripleDES.decrypt(last_layer, reverse_key);
  const layer_2 = bytes.toString(CryptoJS.enc.Utf8);

  // AES256
  const cipher = CryptoJS.AES.decrypt(layer_2, Server.SECRET_KEY);
  if (!cipher) {
    return false;
  }
  const layer_1 = cipher.toString(CryptoJS.enc.Utf8);

  return layer_1;
}
