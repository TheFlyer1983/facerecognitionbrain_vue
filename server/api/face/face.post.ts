/// <reference types="vite/types/importMeta.d.ts" />
import type { ImageResponse } from '~~/types/image';

export default defineEventHandler(async (event) => {
  const ApiKey = import.meta.env.VITE_APP_FACE_PLUS_PLUS_API_KEY;
  const ApiSecret = import.meta.env.VITE_APP_FACE_PLUS_PLUS_API_SECRET;

  const body = await readBody(event);

  const imageUrl: string = body.imageUrl;

  try {
    const response = await $fetch<ImageResponse>(
      'https://api-us.faceplusplus.com/facepp/v3/detect',
      {
        method: 'POST',
        query: {
          api_key: ApiKey,
          api_secret: ApiSecret,
          image_url: imageUrl
        }
      }
    );
    return response;
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request', //'Face++ API request failed',
      message: 'Invalid Image URL'
    });
  }
});
