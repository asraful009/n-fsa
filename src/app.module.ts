import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MulterModule } from "@nestjs/platform-express";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggingInterceptor } from "./common/interceptor/logging.interceptor";
import { FileInfoMiddleware } from "./common/middleware/file-info.middleware";
import configuration from "./config/configuration";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] })],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
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
