export const firebaseAuth = import.meta.env.VITE_FIREBASE_AUTH_URL;
export const firebaseURL = import.meta.env.VITE_FIREBASE_URL;
export const reAuthURL = import.meta.env.VITE_FIREBASE_REAUTH_URL;
export const facePlusPlus = import.meta.env.VITE_APP_FACE_PLUS_PLUS_URL;

export const endpoints = {
  register: `${firebaseAuth}:signUp`,
  signin: `${firebaseAuth}:signInWithPassword`,
  profile: `${firebaseURL}/users/:id.json`,
  delete: `${firebaseAuth}:delete`,
  facePlusPlus
};
