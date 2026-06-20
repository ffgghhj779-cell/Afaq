import { Router } from 'express';
import { requireAuth } from '../../common/middleware/auth.middleware';
import * as authController from './auth.controller';

const router = Router();

/**
 * @route POST /api/v1/auth/otp/send
 * @desc  Send 6-digit OTP to Saudi phone number
 * @access Public
 */
router.post('/otp/send', authController.sendOtp);

/**
 * @route POST /api/v1/auth/otp/verify
 * @desc  Verify OTP and issue JWT session
 * @header X-Client-Type: web | mobile
 * @access Public
 */
router.post('/otp/verify', authController.verifyOtp);

/**
 * @route POST /api/v1/auth/nafath/initiate
 * @desc  Initiate Nafath biometric authentication
 * @access Public
 */
router.post('/nafath/initiate', authController.initiateNafath);

/**
 * @route POST /api/v1/auth/oauth
 * @desc  OAuth login (Google / Apple)
 * @header X-Client-Type: web | mobile
 * @access Public
 */
router.post('/oauth', authController.oauthLogin);

/**
 * @route POST /api/v1/auth/refresh
 * @desc  Rotate access token using refresh token
 * @access Public (requires valid refresh token)
 */
router.post('/refresh', authController.refresh);

/**
 * @route POST /api/v1/auth/logout
 * @desc  Revoke refresh token and clear cookies
 * @access Public
 */
router.post('/logout', authController.logout);

/**
 * @route GET /api/v1/auth/me
 * @desc  Get current authenticated user profile
 * @access Private
 */
router.get('/me', requireAuth, authController.me);

export default router;
