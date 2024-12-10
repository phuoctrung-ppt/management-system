import { Injectable } from '@nestjs/common';
import { UserLoginDTO } from './dto/user-loggin.dto';
import { UsersService } from '../users/users.service';
import { compareSync } from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(userLogin: UserLoginDTO) {
    const user = await this.userService.findByUsername(userLogin.username);
    if (!user) {
      return null;
    }
    if (compareSync(userLogin.password, user.password)) {
      const { password, salt, ...result } = user;
      return this.encodedToken(result);
    }
    return null;
  }

  async encodedToken(user: Partial<User>) {
    const { password, salt, ...result } = user;
    const payload = {
      user: result,
      sub: user.id,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      //   algorithm: 'RS256',
      expiresIn: this.configService.get<string>('jwt.expired'),
    });

    return {
      access_token: token,
    };
  }

  async verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
}
