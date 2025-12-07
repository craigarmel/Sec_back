import {
  Controller,
  Post,
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

    response.cookie('access_token', result.access_token, {
      httpOnly: true, // Protection XSS
      secure: isProduction, // HTTPS uniquement en production
      sameSite: 'strict', // Protection CSRF
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
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return this.authService.logout();
  }
}

