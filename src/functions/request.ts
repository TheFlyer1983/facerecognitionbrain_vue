import axios from 'axios';
import { getAuthTokenInSession } from './storageFunctions';

const client = axios.create();

client.interceptors.request.use(async (config) => {
  const token = getAuthTokenInSession();

  if (!token) return config;

  if (config.headers) {
    config.headers.Authorization = token
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
