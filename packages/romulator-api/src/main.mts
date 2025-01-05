import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { ZRomulatorModule } from "./app/app-module.mjs";

(async function () {
  const app = await NestFactory.create(ZRomulatorModule);
  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("Romulator API")
    .setDescription("The Romulator API")
    .setVersion("1")
    .build();

  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  app.use(helmet());

  await app.listen(3000);
})();
