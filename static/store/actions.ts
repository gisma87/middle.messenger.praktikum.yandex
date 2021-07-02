import Store from './store';
import { mutationsEnum } from './mutations';
import { userInfoType } from './typeStore';
import {chatListType, chatUsers} from './state';

export type actionsKey = keyof actionsType;

export type actionsType = {
  setAuth: (state: Store, payload: boolean) => void;
  setUserInfo: (state: Store, payload: userInfoType) => void;
  setChats: (state: Store, payload: chatListType) => void;
  setActiveChat: (state: Store, payload: string) => void;
  setChatUsers: (state: Store, payload: chatUsers) => void;
  clearState: (state: Store) => void;
  [key: string]: (state: Store, payload: any) => void;
};

export default {
  setAuth(context: Store, payload: boolean) {
    sessionStorage.setItem('auth', payload.toString());
    context.commit(mutationsEnum.setAuth, payload);
  },
  setUserInfo(context: Store, payload: userInfoType) {
    sessionStorage.setItem('auth', 'true');
    sessionStorage.setItem('userInfo', JSON.stringify(payload));
    context.commit(mutationsEnum.setUserInfo, payload);
  },
  setChats(context: Store, payload: chatListType) {
    sessionStorage.setItem('chatsList', JSON.stringify(payload));
    context.commit(mutationsEnum.setChats, payload);
  },
  setActiveChat(context: Store, payload: string) {
    sessionStorage.setItem('activeChat', payload);
    context.commit(mutationsEnum.setActiveChat, payload);
  },
  setChatUsers(context: Store, payload: chatUsers) {
    sessionStorage.setItem('users', JSON.stringify(payload));
    context.commit(mutationsEnum.setChatUsers, payload);
  },
  clearState(context: Store) {
    context.commit(mutationsEnum.clearState);
  },
};
