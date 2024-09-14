import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from './emailTemplates';
import transport from './nodeMailter';
import logger from '../logger';

const sender = process.env.EMAIL_SENDER;

export const sendVerificationEmail = async (email: string, verificationCode: string): Promise<void> => {
  logger.info('Sending verification email');
  try {
    await transport.sendMail({
      from: sender,
      to: email,
      subject: 'Verify Your Email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationCode),
    });
    logger.info('Email send');
  } catch (err) {
    logger.error(`verification sending Error: ${err} `);
    throw err;
  }
};

// Send welcome email

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  try {
    const response = await transport.sendMail({
      from: sender,
      to: email,
      subject: 'Welcome to AuthJs',
      html: WELCOME_EMAIL_TEMPLATE.replace('[Customer Name]', name),
    });
    logger.info('Welcome email sent successfully', response);
  } catch (error) {
    logger.error('Error sending welcome email', error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, resetURL: string): Promise<void> => {
  logger.info('Sending Reset password');
  try {
    await transport.sendMail({
      from: sender,
      to: email,
      subject: 'Reset your password',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
    });
    logger.info('Send Reset password');
  } catch (error) {
    console.error('Error sending password reset email', error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

// Send password reset success email
export const sendResetSuccessEmail = async (email: string): Promise<void> => {
  logger.info('Sending Password Resetting email');
  try {
    const response = await transport.sendMail({
      from: sender,
      to: email,
      subject: 'Password Reset Successful',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });

    logger.info('Send Password Reset email', response);
  } catch (error) {
    logger.error('Error sending password reset success email', error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
