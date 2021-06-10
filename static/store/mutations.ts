import {objType, stateType, userInfoType} from './typeStore';
import initialState, {chatListType, chatUsers} from './state';

export type mutationsKey = keyof mutationsType;

export enum mutationsEnum {
  setAuth = 'setAuth',
  setUserInfo = 'setUserInfo',
  setChats = 'setChats',
  setActiveChat = 'setActiveChat',
  setChatUsers = 'setChatUsers',
  clearState = 'clearState'
}

export type mutationsType = {
  setAuth: (state: stateType, payload: boolean) => stateType;
  setUserInfo: (state: stateType, payload: userInfoType) => stateType;
  setChats: (state: stateType, payload: chatListType) => stateType;
  setActiveChat: (state: stateType, payload: string) => stateType;
  setChatUsers: (state: stateType, payload: chatUsers) => stateType;
  clearState: () => stateType;
  [key: string]: (state: stateType, payload: any) => stateType;
};

function addIsSelectedToChatList(chatsList: objType[], activeChatId: string | number) {
  return chatsList.map(chat => {
    chat.selected = chat?.id?.toString() === activeChatId.toString();
    return chat;
  })

}

export default {
  // addItem(state: stateType, payload: string) {
  //     state.items.push(payload);
  //
  //     return state;
  // },
  // clearItem(state: stateType, payload: { index: number }) {
  //     state.items.splice(payload.index, 1);
  //
  //     return state;
  // },
  setAuth(state: stateType, payload: boolean) {
    return {
      ...state,
      auth: payload,
    };
  },
  setUserInfo(state: stateType, payload: userInfoType) {
    return {
      ...state,
      auth: true,
      userInfo: payload,
    };
  },
  setChats(state: stateType, payload: chatListType) {
    function setChatsResult() {
      if (payload instanceof Array && payload.length) {
        const startId = payload[0].id.toString()
        const activeChatId = state.activeChat ? state.activeChat : startId
        const newChatList = addIsSelectedToChatList(payload, activeChatId)
        const chatObject = newChatList.find(chat => chat?.id?.toString() === payload.toString())
        return {
          ...state,
          chatsList: payload,
          activeChat: activeChatId,
          chat: chatObject ? chatObject : state.chat
        };
      }
      return state
    }

    return setChatsResult()
  },

  setActiveChat(state: stateType, payload: string) {
    function setActiveChatResult() {
      const newChatList =
        state.chatsList instanceof Array && state.chatsList.length
          ? addIsSelectedToChatList(state.chatsList, payload)
          : null;
      const chatObject = newChatList ? newChatList.find(chat => chat?.id?.toString() === payload.toString()) : null;

      return {
        ...state,
        activeChat: payload,
        chat: chatObject ? chatObject : state.chat,
        chatsList: newChatList ? newChatList : state.chatsList,
      };
    }

    return setActiveChatResult()
  },
  setChatUsers(state: stateType, payload: chatUsers) {
    return {
      ...state,
      users: payload,
    };
  },
  clearState() {
    return {
      ...initialState,
    }
  },
};
