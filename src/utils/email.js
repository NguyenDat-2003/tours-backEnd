import nodemailer from 'nodemailer'
import { env } from '~/config/environment'

export const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    auth: {
      user: env.EMAIL_USERNAME,
      pass: env.EMAIL_PASSWORD
    }
  })

  // 2) Define the email options
  const mailOptions = {
    from: 'Dat Nguyenn <hello@datnguynn.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  }

  // 3) Actually send the email
  await transporter.sendMail(mailOptions)
}
