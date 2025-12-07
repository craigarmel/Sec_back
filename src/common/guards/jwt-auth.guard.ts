import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Log pour déboguer
    if (err || !user) {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      
      if (!authHeader && !request.cookies?.access_token) {
        throw new UnauthorizedException('Token manquant. Utilisez "Authorization: Bearer <token>" ou un cookie access_token');
      }
      
      if (info) {
        throw new UnauthorizedException(`Token invalide: ${info.message || info}`);
      }
      
      throw err || new UnauthorizedException('Authentification échouée');
    }
    
    return user;
  }
}

