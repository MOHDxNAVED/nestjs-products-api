// src/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {
    super({
      // 👇 Token kahan se nikalo — Authorization header se
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 👇 Secret key — .env se
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  // 👇 Token valid hai — ab user dhundo
  async validate(payload: { sub: string; email: string, role:string }) {
    const user = await this.userRepo.findOne({
      where: { id: payload.sub }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;  // 👈 Yeh user request mein attach ho jaata hai
  }
}