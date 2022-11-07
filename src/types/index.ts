export interface LoginInfo {
  email: string;
  password: string;
  returnSecureToken?: boolean;
}

export interface RegisterInfo extends LoginInfo {
  name: string;
}

export interface RegisterResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

export interface LoginResponse extends RegisterResponse {
  displayName: string;
  registered: boolean;
}

export interface ReAuthResponse {
  access_token: string;
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
}

export interface RankResponse {
  message: string;
  input: string;
}

export interface FaceLocation {
  leftCol: number;
  topRow: number;
  rightCol: number;
  bottomRow: number;
}

export type NonNullableObject<T extends Record<string, any>> = {
  [P in keyof T]: NonNullable<T[P]>;
};
