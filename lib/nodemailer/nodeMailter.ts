import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  // host: process.env.SMTP_HOST,
  service: 'gmail',
  port: parseInt(process.env.SMTP_PORT as string),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default transport;
