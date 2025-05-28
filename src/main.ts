import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para permitir peticiones desde el frontend
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:80',
      'http://localhost:3000',
      'http://localhost',
      // Agregar más orígenes si es necesario
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Configurar prefijo global para todas las rutas de la API
  app.setGlobalPrefix('api');

  // Configurar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('API para el sistema de comentarios del portfolio')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀Application is running on: http://localhost:${port}`);
  console.log(`📚Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();