import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredPermissions =
      this.reflector.get<string[] | undefined>(
        'permissions',
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest();
    const user = request.user as
      | {
          id: number;
          username: string;
          permissions: string[];
        }
      | undefined;

    if (requiredPermissions.length > 0 && !user) {
      return false;
    }

    for (const requiredPermission of requiredPermissions) {
      if (!user.permissions.includes(requiredPermission)) {
        return false;
      }
    }

    return true;
  }
}
