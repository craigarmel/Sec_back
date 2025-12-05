import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { hashPassword, verifyPassword } from '../common/security/password.util';
import { signToken, verifyToken, type TokenPayload } from '../common/security/token.util';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'change-me';
  private readonly tokenTtlMinutes =
    Number(process.env.ACCESS_TOKEN_TTL_MINUTES ?? 20);
  private readonly revokedTokens = new Set<string>();

  constructor(private readonly usersService: UsersService) {}

  register(dto: RegisterDto) {
    if (!dto.consent) {
      throw new BadRequestException('Le consentement explicite est requis');
    }

    const passwordHash = hashPassword(dto.password);

    const user = this.usersService.create({
      email: dto.email,
      username: dto.name,
      passwordHash,
      role: 'user',
      consent: Boolean(dto.consent),
    });

    return { user: this.sanitizeUser(user) };
  }

  login(dto: LoginDto) {
    const user = this.usersService.findByEmail(dto.email);

    if (!user || !verifyPassword(dto.password, user.passwordHash)) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const accessToken = this.createAccessToken(user);
    return { accessToken, user: this.sanitizeUser(user) };
  }

  logout(token?: string) {
    if (!token) {
      return;
    }
    const payload = verifyToken(token, this.jwtSecret);
    if (payload?.jti) {
      this.revokedTokens.add(payload.jti);
    }
  }

  validateToken(token: string): TokenPayload | null {
    const payload = verifyToken(token, this.jwtSecret);
    if (!payload) {
      return null;
    }
    if (this.revokedTokens.has(payload.jti)) {
      return null;
    }
    return payload;
  }

  private createAccessToken(user: User): string {
    const exp = Math.floor(Date.now() / 1000) + this.tokenTtlMinutes * 60;
    return signToken(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        exp,
      },
      this.jwtSecret,
    );
  }

  private sanitizeUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
