import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { METADATA_KEY_PERMISSION } from '../decorators';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  @Inject()
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const requirePermissions = this.reflector.getAllAndOverride(
      METADATA_KEY_PERMISSION,
      [
        // Guard在class和handler上生效
        context.getClass(),
        context.getHandler(),
      ],
    );

    if (!requirePermissions) {
      return true;
    }

    const permissions = request.user.permissions.map((item) => item.code);

    requirePermissions.forEach((requirePermission) => {
      if (!permissions.includes(requirePermission)) {
        throw new UnauthorizedException('您没有访问该接口的权限');
      }
    });

    return true;
  }
}
