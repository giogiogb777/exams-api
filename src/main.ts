import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { seedDatabase } from './database/seed';

async function bootstrap() {
  // Seed the database
  await seedDatabase();

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  // app.enableCors({
  //   origin: [
  //     'http://localhost:4200', // Angular frontend
  //     'http://localhost:3000', // Local API
  //     /https:\/\/.*\.railway\.app$/, // Railway deployment
  //   ],
  //   credentials: true,
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  // });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('IT Academy Tests API')
    .setDescription('Testing Platform API for Frontend Developers')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token here. You can get one by calling POST /auth/login',
      },
      'jwt',
    )
    .addSecurityRequirements('jwt')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server running on port ${process.env.PORT ?? 3000}`);
  console.log(`Swagger docs available at http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
bootstrap();
