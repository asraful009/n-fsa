import { Controller, Get, Logger, Post } from "@nestjs/common";
import { randomUUID } from "crypto";
import { AppService } from "./app.service";
import keyGenerator from "./common/function/key-generator.function";
import { Token } from "./token.dto";

@Controller("files")
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Post()
  upload(): Token {
    const token: Token = keyGenerator({ id: randomUUID(), file: {} });
    this.logger.verbose(token.privateToken.length);
    return token;
  }
}
