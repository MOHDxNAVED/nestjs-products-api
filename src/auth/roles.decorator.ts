// src/auth/roles.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { Role } from './roles.enum';

export const ROLES_KEY = 'roles';

// 👇 Custom decorator — route par role set karo
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);