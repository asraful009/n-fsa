import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { randomBytes } from "crypto";
import { map, Observable } from "rxjs";
import { ResponceIF } from "../dto/responce.dto";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  private readonly excludeFileDownload = ["AppController/getFile"];
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ResponceIF> {
    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    if (this.excludeFileDownload.indexOf(`${className}/${methodName}`) !== -1) {
      return next.handle();
    }
    return next.handle().pipe(
      map((data) => {
        const status = context.switchToHttp().getResponse()["statusCode"];
        const res: ResponceIF = {
          nonce: randomBytes(128).toString("hex"),
          status,
          timestamp: new Date().toISOString(),
          errorMsg: null,
          payload: { pagination: data[0], data: data[1] },
        };
        return res;
      })
    );
  }
}
