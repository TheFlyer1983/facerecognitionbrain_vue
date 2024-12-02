export default defineEventHandler(async () => {
  const storage = useStorage('data');

  const token = await storage.getItem<string>('token');
  const refreshToken = await storage.getItem<string>('refresh-token');

  return { token, refreshToken };
});
