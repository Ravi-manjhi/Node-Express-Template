import { Router } from 'express';
import * as controller from '../controllers';
import * as auth from '../middlewares';

const router = Router();

router.get('/check-me', auth.authenticated, controller.checkMe);

router.post('/sign-in', controller.signIn);
router.post('/sign-up', controller.signUP);
router.post('/verify-email', controller.verifyEmail);

router.get('/sign-out', controller.signOut);
router.post('/forget-password', controller.forgotPassword);
router.post('/forget-password/:token', controller.resetPassword);

export default router;
