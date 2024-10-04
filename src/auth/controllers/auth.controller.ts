import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../services/auth.service';
import { User } from './../../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  login(@Req() req: Request) {
    const user = req.user as User;
    return this.authService.generateJWT(user);
  }

  @Post('/forgot')
  async forgotPassword(@Body() payload: any) {
    return await this.authService.sendPasswordResetEmail(payload.email);
  }

  @Post('/reset')
  async resetPassword(@Body() payload: any) {
    return await this.authService.resetPassword(
      payload.token,
      payload.password,
    );
  }
}
