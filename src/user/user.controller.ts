import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Post,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserVo } from './vo/login-user.vo';
import { RefreshTokenVo } from './vo/refresh-token.vo';
import { UserListVo } from './vo/user-list.vo';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { storage } from 'src/common/upload/storage';
import { ConfigService } from '@nestjs/config';

@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private redisService: RedisService,
    private emailService: EmailService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return '初始化成功';
  }

  @ApiQuery({
    name: 'email',
    type: String,
    description: '邮箱地址',
    example: 'xxx@qq.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String,
  })
  @Get('register-captcha')
  async captcha(@Query('email') email: string) {
    return this.userService.sendcCaptcha({
      email,
      ttl: 5 * 60,
      cachePrex: 'register',
      subject: '注册',
    });
  }

  @ApiBody({
    type: RegisterUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户已存在',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功/失败',
    type: String,
  })
  @Post('register')
  register(@Body(new ValidationPipe()) registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和token',
    type: LoginUserVo,
  })
  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);
    return vo;
  }

  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和token',
    type: LoginUserVo,
  })
  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);
    return vo;
  }

  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新token',
    example: 'xxx.xxx.xxx',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'token',
    type: RefreshTokenVo,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token已失效，请重新登录',
    type: String,
  })
  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId, true);
      const newAccessToken = this.userService.createToken(user, false);
      const newRefreshToken = this.userService.createToken(user, true);

      const vo = new RefreshTokenVo();
      vo.accessToken = newAccessToken;
      vo.refreshToken = newRefreshToken;
      return vo;
    } catch (e) {
      throw new UnauthorizedException('token已失效，请重新登录');
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息',
    type: UserDetailVo,
  })
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

  @ApiQuery({
    name: 'email',
    type: String,
    description: '邮箱地址',
    example: 'xxx@qq.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String,
  })
  @Get('update_password/captcha')
  async updatePasswordCaptcha(@Query('email') email: string) {
    return this.userService.sendcCaptcha({
      email,
      ttl: 10 * 60,
      cachePrex: 'update_password',
      subject: '更新密码验证码',
    });
  }

  @ApiBearerAuth()
  @ApiBody({
    type: UpdatePasswordDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '修改密码成功/修改密码失败',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/邮箱不正确',
    type: String,
  })
  @Post(['update_password', 'admin/update_password'])
  @RequireLogin()
  async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() passwordDto: UpdatePasswordDto,
  ) {
    return await this.userService.updatePassword(userId, passwordDto);
  }

  @ApiBearerAuth()
  @ApiQuery({
    name: 'email',
    type: String,
    description: '邮箱地址',
    example: 'xxx@qq.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String,
  })
  @Get('update/captcha')
  @RequireLogin()
  async updateCaptcha(@Query('email') email: string) {
    return this.userService.sendcCaptcha({
      email,
      ttl: 5 * 60,
      cachePrex: 'update',
      subject: '更新用户信息',
    });
  }

  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '修改用户信息成功/修改用户信息失败',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/邮箱不正确',
    type: String,
  })
  @Post(['update', 'admin/update'])
  @RequireLogin()
  async updateUser(
    @UserInfo('userId') userId: number,
    @Body() passwordDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(userId, passwordDto);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: '冻结用户成功/冻结用户失败',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在',
    type: String,
  })
  @Post('freeze')
  async freeze(@Body('userId') userId: number) {
    await this.userService.freezeUserById(userId);
    return 'success';
  }

  @ApiBearerAuth()
  @ApiQuery({
    name: 'pageNo',
    type: Number,
    description: '页码',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    description: '每页数量',
    example: 2,
  })
  @ApiQuery({
    name: 'username',
    type: String,
    description: '用户名',
    required: false,
  })
  @ApiQuery({
    name: 'nickName',
    type: String,
    description: '昵称',
    required: false,
  })
  @ApiQuery({
    name: 'email',
    type: String,
    description: '邮箱',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户列表',
    type: UserListVo,
  })
  @Get('list')
  @RequireLogin()
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

  @Post('uploadImage')
  @UseInterceptors(
    FileInterceptor('file', {
      // dest: 'uploads',
      storage: storage,
      limits: {
        // 限制文件大小为3M
        fileSize: 1024 * 1024 * 3,
      },
      fileFilter: (req, file, cb) => {
        // 限制上传文件格式
        const extname = path.extname(file.originalname);
        if (['.png', '.jpg', '.gif'].includes(extname)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('只能上传图片'), false);
        }
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.configService.get('upload_host') + file.path;
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
