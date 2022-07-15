import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import configuration from "./common/config/configuration";

describe("App Testing", () => {
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
      ],
    }).compile();
  });

  describe("1> file uploading", () => {
    it('should return "tokens"', () => {
      //expect(appController.upload()).toBeInstanceOf(Token);
    });
  });
});
