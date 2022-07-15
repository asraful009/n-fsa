import { HttpModule, HttpService } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { firstValueFrom } from "rxjs";
import { rndomInt } from "../common/function/random-int.function";
import configuration from "../common/config/configuration";
import * as FormData from "form-data";
import * as fs from "fs";
import keyGenerator from "../common/function/key-generator.function";
import { randomUUID } from "crypto";

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

  describe("file api", () => {
    let onlineFiles: any[] = [];
    it("upload", async () => {
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

    it("List", async () => {
      let limit = 10;
      let page = 1;
      let netCall = await firstValueFrom(
        httpService.get(
          `http://localhost:${process.env.PORT}/files/list?limit=${limit}&page=${page}`
        )
      );
      let payload = netCall["data"];
      // console.log(payload);
      expect(payload["status"]).toBe(200);
      expect(payload["errorMsg"]).toBeNull();
      limit = -1;
      page = 1;
      netCall = await firstValueFrom(
        httpService.get(
          `http://localhost:${process.env.PORT}/files/list?limit=${limit}&page=${page}`
        )
      );
      payload = netCall["data"];
      onlineFiles = payload["payload"]["data"];
      expect(payload["status"]).toBe(200);
      expect(payload["errorMsg"]).toBeNull();
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

    it("download", async () => {
      for (let i = 0; i < 10; i++) {
        const token = keyGenerator({ id: randomUUID(), file: {} });
        try {
          let netCall = await firstValueFrom(
            httpService.get(
              `http://localhost:${process.env.PORT}/files/${token.publicToken}`
            )
          );
        } catch (error) {
          // const payload = error["data"];
          // console.log(payload);
          expect(error["response"]["status"]).toBe(403);
          // expect(payload["errorMsg"]).not.toBeNull();
          // console.log(error);
        }
      }
      for (const onlineFile of onlineFiles) {
        try {
          let netCall = await firstValueFrom(
            httpService.get(
              `http://localhost:${process.env.PORT}/files/${onlineFile["publicToken"]}`
            )
          );
          expect(netCall["status"]).toBe(200);
        } catch (error) {
          expect(error["response"]["status"]).toBe(403);
        }
      }
    });

    it("delete", async () => {
      for (let i = 0; i < 10; i++) {
        const token = keyGenerator({ id: randomUUID(), file: {} });
        try {
          let netCall = await firstValueFrom(
            httpService.delete(
              `http://localhost:${process.env.PORT}/files/${token.privateToken}`
            )
          );
        } catch (error) {
          // const payload = error["data"];
          // console.log(payload);
          expect(error["response"]["status"]).toBe(403);
          // expect(payload["errorMsg"]).not.toBeNull();
          // console.log(error);
        }
      }
      for (const onlineFile of onlineFiles) {
        try {
          let netCall = await firstValueFrom(
            httpService.delete(
              `http://localhost:${process.env.PORT}/files/${onlineFile["privateToken"]}`
            )
          );
          expect(netCall["status"]).toBe(200);
        } catch (error) {
          expect(error["response"]["status"]).toBe(403);
        }
      }
    });
  });
});
