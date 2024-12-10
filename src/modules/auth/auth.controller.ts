import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserLoginDTO } from './dto/user-loggin.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from 'src/guards/strategies/local.strategy';
import { JwtAuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @UseGuards(LocalStrategy)
  @Post('login')
  async login(@Body() user: UserLoginDTO) {
    return this.authService.signIn(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  async whoAmI(@Request() payload: string) {
    return payload['user'];
  }
}