import type { Response } from 'express';
import type { AuthenticatedRequest } from '../../common/middleware/auth.middleware';
import { getClientType } from '../../common/middleware/auth.middleware';
import {
  sendOtpSchema,
  verifyOtpSchema,
  nafathInitSchema,
  oauthSchema,
} from './auth.schema';
import * as authService from './auth.service';

function authResponse(
  res: Response,
  clientType: 'WEB' | 'MOBILE',
  data: { user: authService.AuthUser; tokens: authService.AuthTokens }
) {
  if (clientType === 'WEB') {
    authService.setWebAuthCookies(res, data.tokens);
    return res.status(200).json({
      success: true,
      data: { user: data.user },
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      user: data.user,
      tokens: {
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
        expiresIn: data.tokens.expiresIn,
        tokenType: 'Bearer',
      },
    },
  });
}

export async function sendOtp(req: AuthenticatedRequest, res: Response) {
  const input = sendOtpSchema.parse(req.body);
  const result = await authService.sendOtp(input);
  res.status(200).json({ success: true, data: result });
}

export async function verifyOtp(req: AuthenticatedRequest, res: Response) {
  const input = verifyOtpSchema.parse(req.body);
  const clientType = getClientType(req);
  const deviceInfo = req.headers['user-agent'];

  const result = await authService.verifyOtpAndLogin(
    input,
    clientType,
    typeof deviceInfo === 'string' ? deviceInfo : undefined
  );

  return authResponse(res, clientType, result);
}

export async function initiateNafath(req: AuthenticatedRequest, res: Response) {
  const input = nafathInitSchema.parse(req.body);
  const result = await authService.initiateNafath(input);
  res.status(200).json({ success: true, data: result });
}

export async function oauthLogin(req: AuthenticatedRequest, res: Response) {
  const input = oauthSchema.parse(req.body);
  const clientType = getClientType(req);
  const deviceInfo = req.headers['user-agent'];

  const result = await authService.handleOAuth(
    input,
    clientType,
    typeof deviceInfo === 'string' ? deviceInfo : undefined
  );

  return authResponse(res, clientType, result);
}

export async function refresh(req: AuthenticatedRequest, res: Response) {
  const clientType = getClientType(req);
  const refreshToken =
    (req.body?.refreshToken as string | undefined) ??
    (req.cookies?.afaq_refresh as string | undefined);

  if (!refreshToken) {
    return res.status(401).json({ success: false, error: 'Refresh token required', code: 'REFRESH_REQUIRED' });
  }

  const tokens = await authService.refreshSession(refreshToken, clientType);

  if (clientType === 'WEB') {
    authService.setWebAuthCookies(res, tokens);
    return res.status(200).json({ success: true, data: { refreshed: true } });
  }

  return res.status(200).json({
    success: true,
    data: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      tokenType: 'Bearer',
    },
  });
}

export async function logout(req: AuthenticatedRequest, res: Response) {
  const refreshToken =
    (req.body?.refreshToken as string | undefined) ??
    (req.cookies?.afaq_refresh as string | undefined);

  await authService.logout(refreshToken);
  authService.clearWebAuthCookies(res);

  res.status(200).json({ success: true, data: { message: 'Logged out successfully' } });
}

export async function me(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Not authenticated', code: 'AUTH_REQUIRED' });
  }
  const user = await authService.getMe(req.user.id);
  res.status(200).json({ success: true, data: { user } });
}
