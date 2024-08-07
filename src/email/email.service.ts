import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('nodemailer_host'),
      port: this.configService.get('nodemailer_port'),
      secure: false,
      auth: {
        user: this.configService.get('nodemailer_auth_user'), // 发送验证码的邮箱
        pass: this.configService.get('nodemailer_auth_pass'), // 邮箱授权码
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统', // 发送者名称
        address: this.configService.get('nodemailer_from_address'), // 发送验证码的邮箱
      },
      to,
      subject,
      html,
    });
  }
}
