export type User = {
  name: string;
  email: string;
  entries: number;
  joined: string | number | Date;
  pet?: string;
  age?: number;
  role?: string;
}

export type UpdateInfo = {
  name?: string;
  pet?: string;
  age?: number;
}
