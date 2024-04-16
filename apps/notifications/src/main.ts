import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { NotificationModule } from './notifications.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('NOTIFICATION'));
  await app.startAllMicroservices();

  // the following works with the "webpack-hrm-config.js" file to speed up reload time for our application
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
