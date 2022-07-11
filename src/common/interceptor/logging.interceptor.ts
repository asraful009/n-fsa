import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Observable, tap } from "rxjs";
const chalk = require("chalk");

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly log = console.log;
  private readonly time = chalk.hex("#CEE5D0");
  private readonly address = chalk.hex("#EB4747");
  private readonly location = chalk.hex("#2E94B9");
  private readonly url = chalk.hex("#EC994B");
  constructor(private readonly eventEmitter: EventEmitter2) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    const statusCode = context.switchToHttp().getResponse()["statusCode"];
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();
    const { rawHeaders, httpVersion, method, socket, url } = request;
    const { remoteAddress, remoteFamily } = socket;
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.log(
            this.address(remoteAddress + " ") +
              this.location("[ " + className + "/" + methodName + " ] ") +
              this.url(method + " " + url) +
              " " +
              this.time(`${Date.now() - now}ms`)
          )
        )
      );
  }
}
