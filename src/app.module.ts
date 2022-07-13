import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { MulterModule } from "@nestjs/platform-express";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HttpExceptionFilter } from "./common/filter/http-exception.filter";
import { LoggingInterceptor } from "./common/interceptor/logging.interceptor";
import { TransformInterceptor } from "./common/interceptor/transform.interceptor";
import { FileInfoMiddleware } from "./common/middleware/file-info.middleware";
import configuration from "./config/configuration";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] })],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FileInfoMiddleware)
      .exclude(
        {
          path: "files",
          method: RequestMethod.GET,
        },
        {
          path: "files",
          method: RequestMethod.DELETE,
        }
      )
      .forRoutes(AppController);
  }
}
