import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HttpExceptionFilter } from "./common/filter/http-exception.filter";
import { LoggingInterceptor } from "./common/interceptor/logging.interceptor";
import { TransformInterceptor } from "./common/interceptor/transform.interceptor";
import { FileInfoMiddleware } from "./common/middleware/file-info.middleware";
import configuration from "./common/config/configuration";
import { FileEntity } from "./common/entity/file.entity";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_USER,
      database: process.env.DB_USER,
      entities: [FileEntity],
      synchronize: true,
      logging: true,
      logger: "file",
    }),
    TypeOrmModule.forFeature([FileEntity]),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      limit: parseInt(process.env.HIT_RATE, 10) || 7,
      ttl: parseInt(process.env.TTL, 10) || 60,
    }),
  ],
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
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
