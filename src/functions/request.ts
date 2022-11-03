import { clarifaiApiKey, endpoints } from '@/constants/api-config';
import axios from 'axios';
import { getAuthTokenInSession } from './storageFunctions';

const client = axios.create();

client.interceptors.request.use(async (config) => {
  const { token } = getAuthTokenInSession();

  if (!token) return config;

  if (config.headers) {
    if (config.url === endpoints.clarifaiURL) {
      config.headers.Authorization = `Key ${clarifaiApiKey}`;
    } else {
      config.headers.Authorization = token;
    }
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error.message);
  }
);

export default client;
