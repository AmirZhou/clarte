import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // integrate dto transformer
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // Pass Reflector
  app.enableCors({
    origin: process.env.NEXT_PUBLIC_SITE_URL,
    methods: 'GET,HEAD,PUT,POST',
    credentials: true, // Allow cookies to be sent (if using authentication)
  });
  await app.listen(process.env.LISTENING_PORT ?? 23010);
}
bootstrap();
