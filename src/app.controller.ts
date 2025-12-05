import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/guards/auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './common/decorators/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('admin/dashboard')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  getAdminDashboard() {
    return { message: 'Dashboard admin sécurisé', ok: true };
  }
}
