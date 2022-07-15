import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import configuration from "../common/config/configuration";
import { TokenDto } from "../common/dto/token.dto";
import keyGenerator from "../common/function/key-generator.function";
describe("keyGenerator", () => {
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
      ],
    }).compile();
  });

  describe("unit test", () => {
    it('should return "tokens"', () => {
      const token: TokenDto = keyGenerator({ id: randomUUID(), file: {} });
      expect(token.privateToken).not.toBe(null);
      expect(token.privateToken).not.toBe(undefined);
      expect(token.privateToken).toMatch(/[0-9A-Fa-f]{90,120}/g);
      expect(token.publicToken).not.toBe(null);
      expect(token.publicToken).not.toBe(undefined);
      expect(token.publicToken).toMatch(/[0-9A-Fa-f]{90,120}/g);
    });
  });
});
