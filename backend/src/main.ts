import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // Specify domains or use a wildcard
    // origin: ['http://localhost:3001', "http://localhost:3002"],
    origin: true, // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type, Accept','Authorization'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
}
bootstrap();
