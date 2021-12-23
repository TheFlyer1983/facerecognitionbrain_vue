export const apiConfig = import.meta.env.VITE_APP_API_URL;

export const endpoints = {
  rank: `${apiConfig}/rank`,
  signin: `${apiConfig}/signin`,
  getProfile: `${apiConfig}/profile/:id`,
  register: `${apiConfig}/register`,
  imageURL: `${apiConfig}/imageURL`
};
