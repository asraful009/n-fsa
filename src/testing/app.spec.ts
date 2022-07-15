import { HttpModule, HttpService } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { firstValueFrom } from "rxjs";
import { rndomInt } from "../common/function/random-int.function";
import configuration from "../common/config/configuration";
import * as FormData from "form-data";
import * as fs from "fs";

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

  describe("1> file api", () => {
    it("should be upload files", async () => {
      const filesPath = fs.readdirSync(process.env.TESTING_IMAGE_FOLDER);
      const form = new FormData();
      // console.log(filesPath);
      for (const filePath of filesPath) {
        form.append(
          "files",
          fs.createReadStream(`${process.env.TESTING_IMAGE_FOLDER}/${filePath}`)
        );
      }
      let netCall = await firstValueFrom(
        httpService.post(`http://localhost:${process.env.PORT}/files`, form, {
          headers: form.getHeaders(),
        })
      );
      const payload = netCall["data"];
      //console.log(payload);
      expect(payload["status"]).toBe(201);
      expect(payload["errorMsg"]).toBeNull();
    });

    it("should be List", async () => {
      for (let i = 0; i < 10; i++) {
        const limit = rndomInt(1, 20);
        const page = rndomInt(1, 20);
        let netCall = await firstValueFrom(
          httpService.get(
            `http://localhost:${process.env.PORT}/files/list?limit=${limit}&page=${page}`
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
