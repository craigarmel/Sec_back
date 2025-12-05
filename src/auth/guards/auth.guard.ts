import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

function extractToken(req: { headers: Record<string, unknown> }) {
  const authHeader =
    typeof req.headers['authorization'] === 'string'
      ? (req.headers['authorization'] as string)
      : undefined;

  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length).trim();
  }

  const cookieHeader =
    typeof req.headers['cookie'] === 'string'
      ? (req.headers['cookie'] as string)
      : '';
  const cookies = Object.fromEntries(
    cookieHeader
      .split(';')
      .map((pair) => {
        const [name, ...rest] = pair.trim().split('=');
        return [name, rest.join('=')];
      })
      .filter((entry) => entry[0] && entry[1] !== undefined),
  );
  return cookies['session'] ? decodeURIComponent(cookies['session']) : null;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, unknown>;
      user?: unknown;
      method?: string;
    }>();
    if (request.method === 'OPTIONS') {
      return true;
    }
    const token = extractToken(request);

    const payload = token
      ? this.authService.validateToken(token)
      : undefined;

    if (!token || !payload) {
      throw new UnauthorizedException('Token invalide ou manquant');
    }

    request.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      token,
    };
    return true;
  }
}
