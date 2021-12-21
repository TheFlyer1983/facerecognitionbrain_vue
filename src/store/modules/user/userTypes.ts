import { ActionContext } from 'vuex';

export type UserActionContext = ActionContext<UserState, {}>

export interface UserState {
  isSignedIn: boolean;
  isProfileOpen: false;
  user: User;
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
