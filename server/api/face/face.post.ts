/// <reference types="vite/types/importMeta.d.ts" />
import type { ImageResponse } from '~~/types/image';

export default defineEventHandler(async (event) => {
  const { facePlusPlusApiKey, facePlusPlusApiSecret, facePlusPlusUrl } = useRuntimeConfig();

  const body = await readBody(event);

  const imageUrl: string = body.imageUrl;

  try {
    const response = await $fetch<ImageResponse>(facePlusPlusUrl, {
      method: 'POST',
      query: {
        api_key: facePlusPlusApiKey,
        api_secret: facePlusPlusApiSecret,
        image_url: imageUrl
      }
    });
    return response;
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid Image URL'
    });
  }
});
