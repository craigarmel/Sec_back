import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../common/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly bcryptRounds = 10; // Coût computationnel approprié

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    // Vérifier le consentement
    if (!registerDto.consentGiven) {
      throw new BadRequestException(
        'Le consentement aux conditions d\'utilisation est requis',
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe avec bcrypt (salt généré automatiquement)
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      this.bcryptRounds,
    );

    const user = this.userRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      consentGiven: true,
      consentDate: new Date(),
      role: UserRole.USER,
    });

    await this.userRepository.save(user);

    return { message: 'Compte créé avec succès' };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return null;
    }

    // Vérifier le mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // Ne pas retourner le mot de passe
    const { password: _, ...result } = user;
    return result as User;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async logout(): Promise<{ message: string }> {
    // La destruction de session se fait via la suppression du cookie côté client
    return { message: 'Déconnexion réussie' };
  }
}

