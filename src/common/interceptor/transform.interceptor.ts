import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { ResponceIF } from "../dto/responce.dto";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ResponceIF> {
    return next.handle().pipe(
      map((data) => {
        const status = context.switchToHttp().getResponse()["statusCode"];
        const res: ResponceIF = {
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
