import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body(new ValidationPipe()) registerUserDto: RegisterUserDto) {
    console.log('register', registerUserDto);
    return 'success';
  }
}
