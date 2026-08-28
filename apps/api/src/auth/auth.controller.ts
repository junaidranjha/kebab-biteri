import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email?: string; phone?: string; password: string; firstName: string; lastName: string }) {
    return this.authService.register(body)
  }

  @Post('login')
  async login(@Body() body: { email?: string; phone?: string; password: string }) {
    return this.authService.login(body)
  }

  // Admin-only login — checks ADMIN/MANAGER role
  @Post('admin/login')
  async adminLogin(@Body() body: { email: string; password: string }) {
    return this.authService.adminLogin(body)
  }

  // Admin registration — creates ADMIN role user
  @Post('admin/register')
  async adminRegister(@Body() body: { email: string; password: string; firstName: string; lastName: string }) {
    return this.authService.adminRegister(body)
  }
}
