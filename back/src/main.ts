import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Usar ValidationPipe globalmente
  app.useGlobalPipes(new ValidationPipe());

  // Prefixo global para as rotas
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3333;
  await app.listen(port);
  console.log(`✅ Servidor rodando em: http://localhost:${port}/api/v1`);
}

bootstrap().catch((error) => {
  console.error('❌ Erro ao iniciar o servidor:', error);
  process.exit(1);
});
