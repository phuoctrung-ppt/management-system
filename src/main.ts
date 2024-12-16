import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  await app
    .listen(config.get<number>('app.port') ?? 3000, () => {
      console.log(
        `Server is running on http://localhost:${config.get<number>('app.port') ?? 3000}`,
      );
    })
    .catch((error) => {
      console.error('Server error', error);
    });
}
bootstrap();
