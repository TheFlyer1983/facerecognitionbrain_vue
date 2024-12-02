export default defineEventHandler(async () => {
  const storage = useStorage('data');

  storage.clear();
});
