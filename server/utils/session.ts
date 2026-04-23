import type { H3Event } from 'h3';

export function setRefreshToken(event: H3Event, refreshToken: string) {
  setCookie(event, 'refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/'
  });
}