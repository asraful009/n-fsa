import { HttpModule, HttpService } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { firstValueFrom } from "rxjs";
import { rndomInt } from "../common/function/random-int.function";
import configuration from "../common/config/configuration";

describe("App Testing", () => {
  let httpService: HttpService;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        HttpModule,
      ],
    }).compile();
    httpService = await app.get<HttpService>(HttpService);
  });

  describe("1> file List", () => {
    it('should return "tokens"', async () => {
      for (let i = 0; i < 10; i++) {
        const limit = rndomInt(1, 20);
        const page = rndomInt(1, 20);
        let netCall = await firstValueFrom(
          httpService.get(
            `http://localhost:8080/files/list?limit=${limit}&page=${page}`
          )
        );
        const payload = netCall["data"];
        // console.log(payload);
        expect(payload["status"]).toBe(200);
        expect(payload["errorMsg"]).toBeNull();
      }
    });
  });
});
