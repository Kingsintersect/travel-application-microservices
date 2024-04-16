import { NestFactory } from '@nestjs/core';
import { HotelsModule } from './hotels.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(HotelsModule);
  await app.listen(3000);
  // the following works with the "webpack-hrm-config.js" file to speed up reload time for our application
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
