import { createTransport } from 'nodemailer'

export class MailService {
  constructor() {
    this.transport = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    })
  }
  async sendMail(email, activationLink) {
    const data = await this.transport.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Activate your account',
      html: `<h1>Activation link</h1><a href='${activationLink}'>${activationLink}</a>`
    })
  }
}

export default MailService
