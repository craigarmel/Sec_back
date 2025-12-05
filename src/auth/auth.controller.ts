import {
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, user } = this.authService.login(body);
    this.attachSessionCookie(res, accessToken);
    return { user };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    const cookieHeader = res.req?.headers['cookie'] as string | undefined;
    const sessionToken = this.extractSession(cookieHeader);
    this.authService.logout(sessionToken ?? undefined);
    res.cookie('session', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
    return { success: true };
  }

  private attachSessionCookie(res: Response, token: string) {
    const maxAgeMinutes = Number(process.env.ACCESS_TOKEN_TTL_MINUTES ?? 20);
    res.cookie('session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: maxAgeMinutes * 60 * 1000,
      path: '/',
    });
  }

  private extractSession(cookieHeader?: string) {
    if (!cookieHeader) return null;
    const cookies = Object.fromEntries(
      cookieHeader
        .split(';')
        .map((pair) => {
          const [name, ...rest] = pair.trim().split('=');
          return [name, rest.join('=')];
        })
        .filter((entry) => entry[0] && entry[1] !== undefined),
    );
    return cookies['session']
      ? decodeURIComponent(cookies['session'])
      : null;
  }
}
