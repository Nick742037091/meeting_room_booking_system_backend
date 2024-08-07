import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo, UserInfo } from './vo/login-user.vo';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,

    private configService: ConfigService,
    private redisService: RedisService,
    private jwtService: JwtService,
  ) {}
  private logger = new Logger();

  async initData() {
    const user1 = new User();
    user1.username = 'zhangsan';
    user1.password = md5('123456');
    user1.email = 'zhangsan@qq.com';
    user1.nickName = '张三';

    const user2 = new User();
    user2.username = 'lisi';
    user2.password = md5('123456');
    user2.email = 'lisi@qq.com';
    user2.nickName = '李四';

    const role1 = new Role();
    role1.name = '管理员';
    const role2 = new Role();
    role2.name = '普通用户';

    const permision = new Permission();
    permision.code = 'ccc';
    permision.description = '访问接口ccc';

    const permision2 = new Permission();
    permision2.code = 'ddd';
    permision2.description = '访问接口ddd';

    role1.permissions = [permision, permision2];
    role2.permissions = [permision2];

    user1.roles = [role1];
    user2.roles = [role2];

    // !注意使用await，否则不会创建关联表
    await this.permissionRepository.save([permision, permision2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
  }

  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    if (user.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.email = user.email;
    newUser.nickName = user.nickName;
    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      this.logger.error(e);
      return '注册失败';
    }
  }

  async login(loginUserDto: LoginUserDto, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (md5(loginUserDto.password) !== user.password) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    const vo = new LoginUserVo();
    vo.userInfo = {
      userId: user.id,
      username: user.username,
      nickName: user.nickName,
      email: user.email,
      headPic: user.headPic,
      phoneNumber: user.phoneNumber,
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      createTime: +user.createTime,
      roles: user.roles.map((role) => role.name),
      permissions: user.roles.reduce((res, role) => {
        role.permissions.forEach((permission) => {
          if (!res.includes(permission.code)) {
            res.push(permission.code);
          }
        });
        return res;
      }, [] as string[]),
    };
    vo.accessToken = this.createToken(vo.userInfo, false);
    vo.refreshToken = this.createToken(vo.userInfo, true);
    return vo;
  }

  createToken(
    userInfo: {
      userId: number;
      username: string;
      roles: string[];
      permissions: string[];
    },
    isRefreshToken: boolean,
  ) {
    return this.jwtService.sign(
      {
        userId: userInfo.userId,
        username: userInfo.username,
        roles: userInfo.roles,
        permissions: userInfo.permissions,
      },
      {
        expiresIn: isRefreshToken
          ? this.configService.get('jwt_refresh_token_expires_time')
          : this.configService.get('jwt_access_token_expires_time'),
      },
    );
  }

  async findUserById(id: number, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        id,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });
    return {
      userId: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      roles: user.roles.map((role) => role.name),
      permissions: user.roles.reduce((res, role) => {
        role.permissions.forEach((permission) => {
          if (!res.includes(permission.code)) {
            res.push(permission.code);
          }
        });
        return res;
      }, [] as string[]),
    };
  }
}
