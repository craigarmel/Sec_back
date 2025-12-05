import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NewUser, User } from './entities/user.entity';
import { hashPassword } from '../common/security/password.util';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private nextId = 1;

  constructor() {
    // Seed a default admin for demo access
    const adminPassword =
      process.env.SEED_ADMIN_PASSWORD || 'AdminStrongPass123!';
    this.create({
      email: 'admin@example.com',
      username: 'admin',
      passwordHash: hashPassword(adminPassword),
      role: 'admin',
      consent: true,
    });
  }

  create(payload: NewUser): User {
    const existing = this.findByEmail(payload.email);
    if (existing) {
      throw new BadRequestException('Email already registered');
    }
    if (this.users.some((u) => u.username === payload.username)) {
      throw new BadRequestException('Username already taken');
    }

    const user: User = {
      id: this.nextId++,
      ...payload,
      role: payload.role ?? 'user',
    };
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find((entry) => entry.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((entry) => entry.email === email);
  }

  remove(id: number): void {
    const before = this.users.length;
    this.users = this.users.filter((entry) => entry.id !== id);

    if (this.users.length === before) {
      throw new NotFoundException('User not found');
    }
  }

  sanitize(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safe } = user;
    return safe;
  }
}
