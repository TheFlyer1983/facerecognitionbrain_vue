export interface LoginInfo {
  email: string;
  password: string;
}

export interface RegisterInfo extends LoginInfo {
  name: string;
}