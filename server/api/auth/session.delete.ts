export default defineEventHandler(async (event) => {
  deleteCookie(event, 'refreshToken');

  return {
    message: 'Refresh token deleted successfully',
    statusCode: 200,
    statusMessage: 'OK'
  };
})
