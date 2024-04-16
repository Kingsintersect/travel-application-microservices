import { NestFactory } from '@nestjs/core';
import { FlightsModule } from './flights.module';
import { ConfigService } from '@nestjs/config';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(FlightsModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));

  // the following works with the "webpack-hrm-config.js" file to speed up reload time for our application
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
