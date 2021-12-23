export interface LoginInfo {
  email: string;
  password: string;
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