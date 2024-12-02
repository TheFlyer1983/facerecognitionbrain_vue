export const firebaseAuth = import.meta.env.VITE_FIREBASE_AUTH_URL;
export const firebaseURL = import.meta.env.VITE_FIREBASE_URL;
export const reAuthURL = import.meta.env.VITE_FIREBASE_REAUTH_URL;

export const endpoints = {
  register: `${firebaseAuth}:signUp`,
  signin: `${firebaseAuth}:signInWithPassword`,
  profile: `${firebaseURL}/users/:id.json`
};
