export const firebaseURL = import.meta.env.VITE_APP_FIREBASE_URL;
export const authURL = import.meta.env.VITE_APP_FIREBASE_AUTH_URL;
export const reAuthURL = import.meta.env.VITE_APP_FIREBASE_REAUTH_URL;
export const rankURL = import.meta.env.VITE_APP_RANK_API;
export const clarifaiApiKey = import.meta.env.VITE_APP_CLARIFAI_API_KEY;

export const endpoints = {
  rank: `${rankURL}/rank`,
  signin: `${authURL}:signInWithPassword`,
  profile: `${firebaseURL}/users/:id.json`,
  register: `${authURL}:signUp`,
  delete: `${authURL}:delete`,
  clarifaiURL:
    'https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs'
};
