export const firebaseURL = import.meta.env.VITE_APP_FIREBASE_URL;
export const authURL = import.meta.env.VITE_APP_FIREBASE_AUTH_URL;

export const endpoints = {
  // rank: `${apiConfig}/rank`,
  signin: `${authURL}:signInWithPassword`,
  profile: `${firebaseURL}/users/:id.json`,
  register: `${authURL}:signUp`,
  delete: `${authURL}:delete`
  // imageURL: `${apiConfig}/imageURL`,
  // image: `${apiConfig}/image`,
  // profile: `${apiConfig}/profile`,
  // user: `${apiConfig}/user`
};
