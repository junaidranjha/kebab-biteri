import { Role } from './enums'

export interface User {
  id: string
  email: string | null
  phone: string | null
  firstName: string
  lastName: string
  role: Role
  avatarUrl: string | null
  marketingConsent: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface RegisterDto {
  email?: string
  phone?: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginDto {
  email?: string
  phone?: string
  password: string
}
