import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import { User } from '../schemas'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService,
  ) {}

  async register(dto: { email?: string; phone?: string; password: string; firstName: string; lastName: string }) {
    const passwordHash = await bcrypt.hash(dto.password, 10)
    const user = await this.userModel.create({
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    })
    return this.generateTokens(user)
  }

  async login(dto: { email?: string; phone?: string; password: string }) {
    const user = await this.userModel.findOne({
      $or: [{ email: dto.email }, { phone: dto.phone }],
    })
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials')
    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Invalid credentials')
    return this.generateTokens(user)
  }

  // Admin login — checks that user has ADMIN role
  async adminLogin(dto: { email: string; password: string }) {
    const user = await this.userModel.findOne({ email: dto.email })
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid admin credentials')
    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Invalid admin credentials')
    if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      throw new ForbiddenException('Access denied. Admin only.')
    }
    return this.generateTokens(user)
  }

  // Admin register — creates a user with ADMIN role
  async adminRegister(dto: { email: string; password: string; firstName: string; lastName: string }) {
    // Check if any admin already exists with this email
    const existing = await this.userModel.findOne({ email: dto.email })
    if (existing) throw new ForbiddenException('Email already registered')

    const passwordHash = await bcrypt.hash(dto.password, 10)
    const user = await this.userModel.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: 'ADMIN',
    })
    return this.generateTokens(user)
  }

  private async generateTokens(user: any) {
    const accessToken = this.jwt.sign({ sub: user._id.toString(), role: user.role })
    const refreshToken = this.jwt.sign({ sub: user._id.toString() }, { expiresIn: '7d' })
    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tokens: { accessToken, refreshToken },
    }
  }
}
