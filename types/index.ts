export type LoginInfo = {
  email: string;
  password: string;
  returnSecureToken?: true;
};

export type LoginResponse = RegisterResponse & {
  displayName: string;
  registered: boolean;
};

export type RegisterInfo = LoginInfo & {
  name: string;
};

export type RegisterResponse = {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
};

export type ReAuthResponse = {
  access_token: string;
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
};

export type RankResponse = {
  input: string;
  message?: string;
};

export type ApiErrors = {
  error: {
    message: 'TOKEN_EXPIRED' | 'USER_DISABLED';
  };
};

export interface FaceLocation {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type NonNullableObject<T extends Record<string, any>> = {
  [P in keyof T]: NonNullable<T[P]>;
};
