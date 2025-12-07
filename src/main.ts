import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';
import * as fs from 'fs';

// Charger les variables d'environnement
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Middleware de sécurité
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Headers de sécurité supplémentaires
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Cookie parser
  app.use(cookieParser());

  // Validation globale avec class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: configService.get('NODE_ENV') === 'production', // Pas d'erreurs détaillées en production
    }),
  );

  // CORS
  const corsOrigin = configService.get('CORS_ORIGIN') || 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = configService.get('PORT') || 4000;
  const httpsEnabled = configService.get('HTTPS_ENABLED') === 'true';

  // Configuration HTTPS (optionnelle pour développement local)
  if (httpsEnabled) {
    const sslKeyPath = configService.get<string>('SSL_KEY_PATH');
    const sslCertPath = configService.get<string>('SSL_CERT_PATH');
    
    if (!sslKeyPath || !sslCertPath) {
      throw new Error('SSL_KEY_PATH and SSL_CERT_PATH must be defined when HTTPS_ENABLED is true');
    }
    
    const httpsOptions = {
      key: fs.readFileSync(sslKeyPath),
      cert: fs.readFileSync(sslCertPath),
    };

    await app.init();
    const server = https.createServer(httpsOptions, app.getHttpAdapter().getInstance());
    await server.listen(port);
    console.log(`Application is running on: https://localhost:${port}`);
  } else {
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
  }

  // Logs en production uniquement pour les erreurs
  if (configService.get('NODE_ENV') === 'production') {
    process.on('unhandledRejection', (reason) => {
      // Logger les erreurs dans un fichier, pas dans la console
      console.error('Unhandled Rejection:', reason);
    });
  }
}

bootstrap();
