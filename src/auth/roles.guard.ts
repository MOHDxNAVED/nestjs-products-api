// src/auth/roles.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    // 👇 Route par kaun sa role chahiye?
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 👇 Koi role set nahi — sabko allow karo
    if (!requiredRoles) {
      return true;
    }

    // 👇 Request se current user nikalo
    const { user } = context.switchToHttp().getRequest();

    // 👇 User ka role match karta hai?
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        'Tumhare paas permission nahi hai — Admin required'
      );
    }

    return true;
  }
}