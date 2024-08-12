import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

export const METADATA_KEY_LOGIN = 'require-login';
export const RequireLogin = () => SetMetadata(METADATA_KEY_LOGIN, true);

export const METADATA_KEY_PERMISSION = 'require-permission';
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata(METADATA_KEY_PERMISSION, permissions);

// UserInfo装饰器，用于快速获取用户信息
export const UserInfo = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      return null;
    }
    return key ? request.user[key] : request.user;
  },
);
