// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Inspecciones y Citas')
    .setDescription('Documentación de la API para los módulos de Usuarios, Citas, y Centros de Inspección.')
    .setVersion('1.0')
    // Define el esquema de seguridad (JWT/Bearer Token)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese su JWT (JSON Web Token)',
        in: 'header',
      },
      'bearerAuth', // Nombre de la clave de seguridad
    )
    .addTag('Appointments', 'Operaciones relacionadas con la gestión de citas')
    .addTag('Users', 'Gestión de usuarios y autenticación')
    .build();

  // 2. Creación del documento
  const document = SwaggerModule.createDocument(app, config);

  // 3. Establecer la ruta donde se servirá la documentación
  SwaggerModule.setup('api/docs', app, document);

  await app.listen( process.env.PORT || 3000 );
}
bootstrap();