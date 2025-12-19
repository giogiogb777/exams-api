import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    if (!username || !password) {
      throw new UnauthorizedException('Username and password are required');
    }

    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
    };
  }

  async logout(token: string): Promise<{ message: string }> {
    // In a production environment, you would typically:
    // 1. Store the token in a blacklist (Redis/Database)
    // 2. Check the blacklist on protected routes
    // For now, we just validate the token exists and is valid
    try {
      this.jwtService.verify(token);
      return { message: 'Successfully logged out' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
