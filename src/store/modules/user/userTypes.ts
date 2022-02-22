import { ActionContext } from 'vuex';

export type UserActionContext = ActionContext<UserState, {}>

export interface UserState {
  isSignedIn: boolean;
  isProfileOpen: boolean;
  user: User | null;
  token: string;
  rank: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  entries: number;
  joined: string | number | Date;
  pet: string;
  age: number;
}

export interface UpdateInfo {
  name?: string;
  pet?: string;
  age?: number;
}
