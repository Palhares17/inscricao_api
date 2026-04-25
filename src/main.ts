import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Sistema de Inscrição API')
    .setDescription(
      'Nesse documento serão listados todas as rotas/endpoint disponíveis para uso',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Insira o token de autenticação no campo abaixo`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('/docs', app, document);

  app.setGlobalPrefix('api');
  await app.listen(3333);

  console.log(`🔥 Application is running on: http://localhost:3333/api`);
}
bootstrap();
