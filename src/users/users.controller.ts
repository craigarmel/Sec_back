import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService
      .findAll()
      .map((user) => this.usersService.sanitize(user));
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req: Request) {
    const currentUserId = (req.user as { id: number }).id;
    const user = this.usersService.findOne(currentUserId);
    return this.usersService.sanitize(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = id;
    const currentUserId = (req.user as { id: number }).id;
    const currentUserRole = (req.user as { role: string }).role;

    if (currentUserRole !== 'admin' && currentUserId !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    const user = this.usersService.findOne(userId);
    return this.usersService.sanitize(user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.usersService.remove(id);
    return { deleted: true };
  }
}
