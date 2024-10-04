import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import { PayloadToken } from '../models/token.model';
import { UserService } from './../../users/services/user.service';
import { User } from './../../users/entities/user.entity';
import { EmailService } from './../../email/services/email.service';
import config from './../../config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      // exclud password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  generateJWT(user: User) {
    const payload: PayloadToken = { role: user.role, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    const resetToken = this.generateResetToken(user);
    user.resetToken = resetToken;

    await this.userService.update(user.id, user);
    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Cambio de contraseña',
      html: `<p>¿Olvidaste tu contraseña?</p>
                <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. ¡No te preocupes nos puede pasar a todos!.</p>
                <p>Crear tu nueva contraseña es muy fácil, solo debes hacer clic en el siguiente botón:</p>
                <a href="${this.configService.appUrl}/auth/reset/${resetToken}">Restablecer contraseña</a>
                <p>Si no solicitaste recuperar tu contraseña, ignora este correo y tu contraseña seguira siendo la misma.</p>`,
      from: 'Pruebas app',
      // attachments: [

      //   {
      //     filename: 'logo.png',
      //     path: 'https://www.rover.com/blog/wp-content/uploads/2019/05/amore-11.jpg',
      //     cid: 'logo',
      //   },
      // ],
    });

    return {
      message: 'Password reset email sent successfully',
      // email,
      // resetToken,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.validateResetToken(token);
    if (!user) {
      throw new BadRequestException(`Invalid reset token`);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear token reset
    user.resetToken = '';
    await this.userService.update(user.id, user);

    return { message: `Password reset succesfuly` };
  }

  private generateResetToken(user: User): string {
    const payload: PayloadToken = {
      sub: user.id,
      role: user.role,
    };

    // expiration token
    const expiresIn = '5m';

    return this.jwtService.sign(payload, { expiresIn });
  }

  private async validateResetToken(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token);
      const user = await this.userService.findOne(decodedToken.sub);
      if (!user || user.resetToken !== token) {
        return null;
      }
      return user;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Reset token has expired');
      }
      throw new BadRequestException('Invalid reset token');
    }
  }
}
