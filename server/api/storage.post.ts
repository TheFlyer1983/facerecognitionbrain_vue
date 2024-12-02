export default defineEventHandler(async (event) => {
  const storage = useStorage('data');

  const { token, refreshToken } = await readBody<{
    token: string;
    refreshToken: string;
  }>(event);

  await storage.setItem('token', token);
  await storage.setItem('refresh-token', refreshToken);
});
