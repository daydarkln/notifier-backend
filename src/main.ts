import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin:
        process.env.NODE_ENV === 'production'
          ? 'https://order-notifier.vercel.app'
          : 'http://localhost:5173',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    },
  });
  // app.use(morgan('dev')); // Для development
  // app.use(morgan('combined')); // Для production

  // Или кастомный формат
  // app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

  const config = new DocumentBuilder()
    .setTitle('Shawarma Order Notification System')
    .setDescription('API documentation for Shawarma Order Notification System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Для генерации файла только в development режиме
  if (process.env.NODE_ENV !== 'production') {
    writeFileSync('./openapi.json', JSON.stringify(document));
  }

  app.setGlobalPrefix('api');

  SwaggerModule.setup('api', app, document);

  await app.listen(5000);
}
bootstrap();
