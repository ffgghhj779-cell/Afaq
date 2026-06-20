import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    clientType: 'WEB' | 'MOBILE';
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const bearerToken = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null;

    const cookieToken = req.cookies?.afaq_access as string | undefined;
    const token = bearerToken ?? cookieToken;

    if (!token) {
      res.status(401).json({ success: false, error: 'Authentication required', code: 'AUTH_REQUIRED' });
      return;
    }

    const payload = await verifyAccessToken(token);
    if (!payload.sub) {
      res.status(401).json({ success: false, error: 'Invalid token', code: 'INVALID_TOKEN' });
      return;
    }

    req.user = {
      id: payload.sub,
      role: payload.role as string,
      clientType: payload.clientType as 'WEB' | 'MOBILE',
    };
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Token expired or invalid', code: 'TOKEN_EXPIRED' });
  }
}

export function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const bearerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;
  const cookieToken = req.cookies?.afaq_access as string | undefined;
  const token = bearerToken ?? cookieToken;

  if (!token) {
    next();
    return;
  }

  verifyAccessToken(token)
    .then((payload) => {
      if (payload.sub) {
        req.user = {
          id: payload.sub,
          role: payload.role as string,
          clientType: payload.clientType as 'WEB' | 'MOBILE',
        };
      }
      next();
    })
    .catch(() => next());
}

export function getClientType(req: Request): 'WEB' | 'MOBILE' {
  const header = req.headers['x-client-type'];
  return header === 'mobile' ? 'MOBILE' : 'WEB';
}
