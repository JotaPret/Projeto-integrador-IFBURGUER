import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // Habilitar CORS
  const allowedOrigins = (process.env.FRONTEND_ORIGIN ||
    'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Requests sem Origin (ex: curl, Postman) devem ser aceitos.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
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
