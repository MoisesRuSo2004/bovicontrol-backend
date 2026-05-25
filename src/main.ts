import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3000);
  const apiPrefix = configService.get<string>('app.apiPrefix', 'api/v1');

  app.setGlobalPrefix(apiPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('BoviControl API')
    .setDescription('Plataforma Inteligente para Gestión Ganadera — API REST')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Autenticación y sesiones')
    .addTag('Farms', 'Gestión de fincas')
    .addTag('Users', 'Gestión de usuarios')
    .addTag('Breeds', 'Razas del ganado')
    .addTag('Animals', 'Registro de animales')
    .addTag('Genealogy', 'Genealogía y genética')
    .addTag('Reproduction', 'Control reproductivo')
    .addTag('Health', 'Sanidad y vacunas')
    .addTag('Production', 'Producción (leche y pesajes)')
    .addTag('Finance', 'Finanzas y ventas')
    .addTag('Notifications', 'Notificaciones')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(port);
  console.log(
    `🚀 BoviControl API corriendo en http://localhost:${port}/${apiPrefix}`,
  );
  console.log(`📚 Swagger docs en http://localhost:${port}/docs`);
}

bootstrap();
