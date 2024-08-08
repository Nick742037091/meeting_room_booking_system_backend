import { JwtService } from '@nestjs/jwt';
import {
  Body,
  Controller,
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
} from 'src/common/decorator';

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
    console.log('register', registerUserDto);
    return this.userService.register(registerUserDto);
  }

  @Get('register-captcha')
  async captcha(@Query('email') email: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${email}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: email,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return '发送成功';
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

  @Get('aaa')
  @RequireLogin()
  @RequirePermission('ddd')
  async aaa(@UserInfo() userInfo, @UserInfo('userId') userId) {
    console.log('aaa', userInfo, userId);
    return 'aaa';
  }

  @Get('bbb')
  async bbb() {
    return 'bbb';
  }
}
