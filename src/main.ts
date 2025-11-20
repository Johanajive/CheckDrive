import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Añadimos el filtro global de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  // Opciones de swagger
  const config = new DocumentBuilder()
    .setTitle('CheckDrive API')
    .setDescription('API para users, auth y logs')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'Authorization', in: 'header' },
      'bearerAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      url: '/api-json'
    },
    customCssUrl: [
      'https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui.css',
    ],
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-standalone-preset.js',
    ]
  }

  SwaggerModule.setup('api/docs', app, document, customOptions);

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();