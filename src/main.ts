import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppClusterService } from "./app-cluster.service";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("FSA")
    .setDescription("File Sharing API")
    .setVersion("1.0")
    .addTag("fsa")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("doc", app, document);
  const port = parseInt(process.env.PORT, 10) || 8080;
  await app.listen(port);
  console.log(`FSA is running on http://localhost:${port}/`);
  console.log(`FSA DOC is running on http://localhost:${port}/doc`);
}
bootstrap();
// AppClusterService.Clusterize(bootstrap);
