import { createHmac, randomBytes } from "crypto";
import { Token } from "src/token.dto";

export default function keyGenerator(info: { id: string; file: any }): Token {
  let nonce = randomBytes(256);
  const privateToken = createHmac("sha384", process.env.PRIVATE_SECRET)
    .update(JSON.stringify({ ...info, nonce }))
    .digest("hex");
  nonce = randomBytes(256);
  const publicToken = createHmac("sha384", process.env.PUBLIC_SECRET)
    .update(JSON.stringify({ ...info, nonce }))
    .digest("hex");
  return { publicToken, privateToken };
}
