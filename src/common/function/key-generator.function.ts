import { createHmac, randomBytes } from "crypto";
import { TokenDto } from "../dto/token.dto";

export default function keyGenerator(info: {
  id: string;
  file: { [key: string]: string };
}): TokenDto {
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
