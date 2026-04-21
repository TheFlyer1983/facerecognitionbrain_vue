import { setRefreshToken } from '~~/server/utils/session';

export default defineEventHandler(async (event) => {
  const { refreshToken } = await readBody(event);

  if (!refreshToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Refresh token is required'
    });
  }

  setRefreshToken(event, refreshToken);

  return {
    message: 'Refresh token set successfully'
  };
});
