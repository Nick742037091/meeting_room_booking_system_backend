import { JwtService } from '@nestjs/jwt';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Post,
  Query,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { LoginUserDto } from './dto/login-user.dto';
import {
  RequireLogin,
  RequirePermission,
  UserInfo,
} from 'src/common/decorators';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateParseIntPipe } from 'src/utils';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private redisService: RedisService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return '初始化成功';
  }

  @Post('register')
  register(@Body(new ValidationPipe()) registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @Get('register-captcha')
  async captcha(@Query('email') email: string) {
    return this.userService.sendcCaptcha({
      email,
      ttl: 5 * 60,
      cachePrex: 'register',
      subject: '注册',
    });
  }

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);
    return vo;
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);
    return vo;
  }

  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId, true);
      const newAccessToken = this.userService.createToken(user, false);
      const newRefreshToken = this.userService.createToken(user, true);
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('token已失效，请重新登录');
    }
  }

  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId) {
    const user = await this.userService.findUserDetailById(userId);
    const vo = new UserDetailVo();
    vo.id = user.id;
    vo.username = user.username;
    vo.nickName = user.nickName;
    vo.email = user.email;
    vo.headPic = user.headPic;
    vo.phoneNumber = user.phoneNumber;
    vo.isFrozen = user.isFrozen;
    vo.createTime = user.createTime;
    return vo;
  }

  @Get('update_password/captcha')
  async updatePasswordCaptcha(@Query('email') email: string) {
    return this.userService.sendcCaptcha({
      email,
      ttl: 10 * 60,
      cachePrex: 'update_password',
      subject: '更新密码验证码',
    });
  }

  @Post(['update_password', 'admin/update_password'])
  @RequireLogin()
  async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() passwordDto: UpdatePasswordDto,
  ) {
    return await this.userService.updatePassword(userId, passwordDto);
  }

  @Get('update/captcha')
  async updateCaptcha(@Query('email') email: string) {
    return this.userService.sendcCaptcha({
      email,
      ttl: 5 * 60,
      cachePrex: 'update',
      subject: '更新用户信息',
    });
  }

  @Post(['update', 'admin/update'])
  @RequireLogin()
  async updateUser(
    @UserInfo('userId') userId: number,
    @Body() passwordDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(userId, passwordDto);
  }

  @Post('freeze')
  async freeze(@Body('userId') userId: number) {
    await this.userService.freezeUserById(userId);
    return 'success';
  }

  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(2),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('username') userName: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string,
  ) {
    return await this.userService.findUserByPage(
      pageNo,
      pageSize,
      userName,
      nickName,
      email,
    );
  }

  @Get('aaa')
  @RequireLogin()
  @RequirePermission('ddd')
  async aaa(@UserInfo('userId') userId) {
    console.log('request aaa, userId: ', userId);
    return 'aaa';
  }

  @Get('bbb')
  async bbb() {
    return 'bbb';
  }
}
