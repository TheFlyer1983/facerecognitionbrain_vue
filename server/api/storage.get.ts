export default defineEventHandler(async () => {
  const storage = useStorage<string>('data');

  const token = await storage.getItem('token');
  const refreshToken = await storage.getItem('refresh-token');

  return { token, refreshToken };
});
