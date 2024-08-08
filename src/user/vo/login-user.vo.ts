import { Permission } from '../entities/permission.entity';

export class UserInfo {
  userId: number;
  username: string;
  nickName: string;
  email: string;
  headPic: string;
  phoneNumber: string;
  isFrozen: boolean;
  isAdmin: boolean;
  createTime: number;
  roles: string[];
  permissions: Permission[];
}

export class LoginUserVo {
  userInfo: UserInfo;
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  userId: number;
  username: string;
  roles: string[];
  permissions: Permission[];
}
