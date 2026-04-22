export default defineEventHandler(async (event) => {
  deleteCookie(event, 'refreshToken', { path: '/' });

  return {
    message: 'Refresh token deleted successfully',
  };
})
