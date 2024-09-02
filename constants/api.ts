export const firebaseAuth = import.meta.env.VITE_FIREBASE_AUTH_URL
export const firebaseURL = import.meta.env.VITE_FIREBASE_URL

export const endpoints = {
  register: `${firebaseAuth}:signUp`,
  profile: `${firebaseURL}/users/:id.json`
};