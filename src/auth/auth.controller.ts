import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../common/entities/user.entity';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @CurrentUser() user: User,
    @Body() _loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(user);

    // Cookie sécurisé
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const maxAge = 30 * 60 * 1000; // 30 minutes
    // En développement, utiliser 'lax' pour permettre la navigation (retour en arrière, etc.)
    // En production, utiliser 'strict' pour une meilleure protection CSRF
    const sameSite = isProduction ? 'strict' : 'lax';

    response.cookie('access_token', result.access_token, {
      httpOnly: true, // Protection XSS
      secure: isProduction, // HTTPS uniquement en production
      sameSite: sameSite, // Protection CSRF (lax en dev, strict en prod)
      maxAge: maxAge,
      path: '/',
    });

    return {
      message: 'Connexion réussie',
      user: result.user,
      access_token: result.access_token, // Pour faciliter les tests avec Postman
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    // Détruire le cookie
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const sameSite = isProduction ? 'strict' : 'lax';
    
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: sameSite,
      path: '/',
    });

    return this.authService.logout();
  }

  @UseGuards(JwtAuthGuard)
  @Get('session')
  @HttpCode(HttpStatus.OK)
  async getSession(@CurrentUser() user: User) {
    // Retourner l'utilisateur actuel depuis le JWT
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
      authenticated: true,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@CurrentUser() user: User) {
    // Alias pour getSession, retourne juste l'utilisateur
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

