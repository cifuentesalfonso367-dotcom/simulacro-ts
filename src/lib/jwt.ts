import jwt from 'jsonwebtoken';
import { JwtCustomPayload } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';

export const signAccessToken = (payload: JwtCustomPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

export const signRefreshToken = (payload: JwtCustomPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): JwtCustomPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtCustomPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtCustomPayload | null => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtCustomPayload;
  } catch {
    return null;
  }
};
