import {Block, Iprops} from '../../service/Block/block';
import {Popup} from '../../service/popup';
import {FormValidator} from '../../service/formValidator';
import {chatApi} from '../../service/API/chat-api';
import {chatTmpl} from './chat.tmpl';
import {dataForChatPage} from './constants';
import {historyPush} from '../../service/utils';
import store from '../../store/index';
import {mutationsEnum} from '../../store/mutations';
import {stateType} from "../../store/typeStore";
import {webSocketApi} from "../../service/API/webSocket-api";

const chatProps = () => {
  return {
    root: 'root',
    template: chatTmpl,
    data: dataForChatPage(),
    store: store,
    callbackAfterRender: () => {
      setValidator();
    },
  };
};

class Chats extends Block {
  callbackAfterRender: () => void;
  popups: Popup | undefined;
  setPopup: () => Popup;

  constructor(getProps: () => Iprops, setPopup: () => Popup) {
    super(getProps);
    this.callbackAfterRender = this.props.callbackAfterRender || (() => {});
    this.setPopup = setPopup;
  }

  componentDidMount() {
    this.callbackAfterRender();
    this.popups = this.setPopup();

    if (!store.state.chatsList?.length) {
      chatApi.getChats();
    }
    this.scrollToBottomChatBlock();
  }

  componentDidUpdate(prevProps: Iprops, prevState: stateType) {
    this.callbackAfterRender();
    this.popups = this.setPopup();

    if (prevProps.store?.state?.activeChat && prevState.activeChat) {
      const isEqualProps = this.props.store?.state?.activeChat?.toString() === prevState.activeChat.toString()
      const activeChatId = this.props.store?.state?.activeChat
      if (!isEqualProps && activeChatId) {
        chatApi.getChatUsers(activeChatId)
          .then(response => {
            store.dispatch(mutationsEnum.setChatUsers, response);
          })
      }
    }
    this.scrollToBottomChatBlock()
  }

  scrollToBottomChatBlock() {
    const messageBlock = document.querySelector('.messageBlock__content')
    console.log('messageBlock: ', messageBlock)
    if(messageBlock) messageBlock.scrollTo(0, messageBlock?.scrollHeight);
  }
}

const historyPushProfile = (event: Event) => {
  event.preventDefault();
  historyPush('/profile');
};

const chats = new Chats(chatProps, setPopup);
chats.addListener('.chatBlock__historyTitle', 'click', historyPushProfile);
chats.addListener('#selectActiveChat', 'change', setActiveChat);

function submit(data: { [key: string]: string }) {
  const key = Object.keys(data)?.[0];
  switch (key) {
    case 'createChat':
      console.log('createChat: ', data);
      chatApi
        .createNewChat({title: data[key]})
        .then(res => {
          if ((res as Response).status === 200) {
            chats.popups?.removeClassActivePopup();
            chatApi.getChats();
          }
        })
        .catch(e => console.log(e));
      break;
    case 'loginAdd':
      console.log('loginAdd: ', data);
      chatApi.searchUserByLogin(data[key])
        .then(res => {
          if ((res as Response).status === 200) {
            const response = JSON.parse((res as { [key: string]: any })?.response)
            if (response.length < 1) {
              console.log('Такого пользователя нет')
            } else {
              const id = response[0].id;
              const chatId = store.state?.activeChat;
              console.log('ID: ', id)
              if (chatId) {
                chatApi.addUserToChat({
                  "users": [id],
                  "chatId": chatId
                })
                  .finally(() => {
                    chats.popups?.removeClassActivePopup();
                    chatApi.getChats()
                  })
              }
            }

          }
        })
        .catch(e => console.log(e))
      break;
    case 'loginDel':
      console.log('loginDel: ', data);
      // chatApi.searchUserByLogin(data[key])
      //     .then(res => {
      //         if ((res as Response).status === 200) {
      //             const response = JSON.parse((res as { [key: string]: any })?.response)
      //             if (response.length < 1) {
      //                 console.log('Такого пользователя нет')
      //             } else {
      //                 const id = response[0].id
      //                 console.log('ID: ', id)
      //                 chatApi.deleteUserChat({
      //                     "users": [id],
      //                     "chatId": chatsListAndUsersList.state[0].chat.id
      //                 })
      //                     .finally(() => {
      //                         chats.popups?.removeClassActivePopup();
      //                         chatApi.getChats()
      //                     })
      //             }
      //
      //         }
      //     })
      //     .catch(e => console.log(e))
      break;
    case 'message':
      if(store.state?.activeChat) webSocketApi.send({message: data.message, chatID: store.state?.activeChat});
      break;
    default:
      console.log(data);
      console.log("обработчик submit'а в разработке...");
  }
}

function setActiveChat(event: Event) {
  console.log('ACTIVE_CHAT: ID ', (<HTMLInputElement>event.target).value);
  store.dispatch(
    mutationsEnum.setActiveChat,
    (<HTMLInputElement>event.target).value,
  );
}

function setPopup() {
  const backdrop: HTMLElement | null = document.querySelector('.backdrop');
  const buttonSetting: HTMLElement | null = document.querySelector(
    '.messageBlock__buttonSettingContainer',
  );
  const buttonAttach: HTMLElement | null = document.querySelector(
    '.messageBlock__attachButton',
  );
  const popupSetting: HTMLElement | null =
    document.querySelector('.popupSetting');
  const popupAttach: HTMLElement | null =
    document.querySelector('.popupAttach');
  const popupFormAddUser: HTMLElement | null =
    document.querySelector('.popupFormAddUser');
  const popupFormRemoveUser: HTMLElement | null = document.querySelector(
    '.popupFormRemoveUser',
  );
  const buttonRemoveUser: HTMLElement | null =
    document.querySelector('.buttonRemoveUser');
  const buttonAddUser: HTMLElement | null =
    document.querySelector('.buttonAddUser');
  const buttonCreateChat: HTMLElement | null = document.querySelector(
    '.chatBlock__createChatBtn',
  );
  const popupCreateChat: HTMLElement | null =
    document.querySelector('.popupCreateChat');

  const statePopup: {
    button: HTMLElement | null;
    popup: HTMLElement | null;
    backDropDark?: boolean;
  }[] = [
    {button: buttonSetting, popup: popupSetting, backDropDark: false},
    {button: buttonAttach, popup: popupAttach, backDropDark: false},
    {button: buttonAddUser, popup: popupFormAddUser, backDropDark: true},
    {
      button: buttonRemoveUser,
      popup: popupFormRemoveUser,
      backDropDark: true,
    },
    {button: buttonCreateChat, popup: popupCreateChat, backDropDark: true},
  ];

  const popups = new Popup(statePopup, backdrop);
  popups.setEventListeners();
  return popups;
}

function setValidator() {
  const forms = document.querySelectorAll('form');
  const formValidators: FormValidator[] = [];

  if (forms) {
    forms.forEach(form => formValidators.push(new FormValidator(form, submit)));
  }

  formValidators.forEach(formValidator => {
    if (formValidator) formValidator.setEventListeners();
  });
}

// function getChat() {
//     chatApi.getChats()
//         .then(res => {
//             const status = (res as { [key: string]: any }).status;
//             const response = JSON.parse((res as { response: any }).response);
//             if (status === 200) {
//                 store.dispatch(mutationsEnum.setChats, response)
//             } else {
//                 console.log('Ошибка при запросе: ', status)
//             }
//         })
//         .catch(e => console.log('Ошибка при запросе: ', e))
// }

export {chats};
