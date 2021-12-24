import { ActionContext } from 'vuex';

export type UserActionContext = ActionContext<UserState, {}>

export interface UserState {
  isSignedIn: boolean;
  isProfileOpen: false;
  user: User | null;
  token: string;
  rank: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  entries: number;
  joined: string;
  pet: string;
  age: string;
}
