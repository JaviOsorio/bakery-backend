import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigType } from '@nestjs/config';

import { EmailService } from './services/email.service';
import config from './../config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [config.KEY],
      useFactory: async (configService: ConfigType<typeof config>) => {
        return {
          transport: {
            host: configService.emailServer.host,
            port: configService.emailServer.port, // Puerto seguro para TLS
            secure: false,
            auth: {
              user: configService.emailServer.user,
              pass: configService.emailServer.password,
            },
          },
          defaults: {
            from: configService.emailServer.from,
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
