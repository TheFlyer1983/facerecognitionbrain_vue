export interface LoginInfo {
  email: string;
  password: string;
  returnSecureToken?: boolean;
}

export interface LoginResponse {
  success: boolean;
  userId: number;
  token: string;
}

export interface RegisterInfo extends LoginInfo {
  name: string;
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
