import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    appUrl: process.env.APP_URL,
    jwtSecret: process.env.JWT_SECRET,
    emailServer: {
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      user: process.env.EMAIL_SERVER_USER,
      password: process.env.EMAIL_SERVER_PASSWORD,
      from: process.env.EMAIL_SERVER_FROM,
    },
    mysql: {
      dbName: process.env.MYSQL_DB,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT, 10),
    },
  };
});
