import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  Response,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { User } from '../users/entities/user.entity';
import { LocalAuthGuard } from './local/local-auth.guard';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    const userWithoutPsw: Partial<User> = req.user;

    return this.authenticationService.login(userWithoutPsw);
  }

  @Post('2fa/generate')
  @UseGuards(JwtAuthGuard)
  async register(@Response() response, @Request() request) {
    const { otpAuthUrl } =
      await this.authenticationService.generateTwoFactorAuthenticationSecret(
        request.user,
      );

    return response.json(
      await this.authenticationService.generateQrCodeDataURL(otpAuthUrl),
    );
  }

  @Post('2fa/turn-on')
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(@Request() request, @Body() body) {
    const isCodeValid =
      this.authenticationService.isTwoFactorAuthenticationCodeValid(
        body.twoFactorAuthenticationCode,
        request.user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.usersService.turnOnTwoFactorAuthentication(request.user.id);
  }

  @Post('2fa/authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async authenticate(@Request() request, @Body() body) {
    const isCodeValid = this.authenticationService.isTwoFactorAuthenticationCodeValid(
      body.twoFactorAuthenticationCode,
      request.user,
    );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    return this.authenticationService.loginWith2fa(request.user);
  }
}
