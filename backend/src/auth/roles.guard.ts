import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../users/users.entity'; // Adjust path as needed
import { ROLES_KEY } from './roles.decorator'; // Adjust path as needed

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // If no roles are specified, allow access
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      return false; // No user or no role assigned to user
    }

    // Check if the user's role is included in the required roles
    return requiredRoles.some((role) => user.role === role);
  }
}
