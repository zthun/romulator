import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { ZRomulatorModule } from "./app/app-module.mjs";

const PORT = 3000;

void (async function main() {
  const app = await NestFactory.create(ZRomulatorModule);
  app.setGlobalPrefix("api");
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle("Romulator API")
    .setDescription("The Romulator API")
    .setVersion("1")
    .build();

  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(PORT);
})();
