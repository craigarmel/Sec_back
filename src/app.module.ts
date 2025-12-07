import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// DÉSACTIVÉ POUR LE DÉVELOPPEMENT - Réactiver en production
// import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
// import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LegalController } from './common/controllers/legal.controller';
import { User } from './common/entities/user.entity';
import { Post } from './common/entities/post.entity';
import { Comment } from './common/entities/comment.entity';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    // Configuration globale
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Base de données
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
    }),

    // Rate limiting pour protéger contre les attaques par force brute
    // DÉSACTIVÉ POUR LE DÉVELOPPEMENT - Réactiver en production
    // ThrottlerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => [
    //     {
    //       ttl: 60000, // 1 minute
    //       limit: 10, // 10 requêtes par minute
    //     },
    //   ],
    // }),

    // Modules fonctionnels
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [AppController, LegalController],
  providers: [
    AppService,
    // DÉSACTIVÉ POUR LE DÉVELOPPEMENT - Réactiver en production
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Middleware de sécurité appliqué globalement
    // consumer.apply(SecurityMiddleware).forRoutes('*');
  }
}
