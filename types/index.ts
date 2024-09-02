export type LoginInfo = {
  email: string;
  password: string;
  returnSecureToken?: true;
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

export type User = {
  name: string;
  email: string;
  entries: number;
  joined: string | number | Date;
  pet?: string;
  age?: number;
  role?: string;
}