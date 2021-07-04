import {Button} from '../../components/Button/Button';
import store from '../../store/index';
import {messageType} from "../../store/state";

type messageListType = {
  userId: string | number,
  name: string,
  message: string,
  time: string,
  isMy: boolean
}

function getUserName(userId: string | number) {
  const users = store.state.users;
  const user = users.find(item => item.id?.toString() === userId?.toString())
  if (user) return `${user.first_name} ${user.second_name}`
  return null
}

function getHours(time: string) {
  const date = new Date(Date.parse(time));
  return `${date.getHours()}:${date.getMinutes()}`
}

function buildMessageList(list: messageType[]) {
  const resultList: messageListType[] = []
  list.forEach(item => {
    if (item instanceof Array) return null;
    if ((item.type !== "user connected") && !item.content?.length) return null;

    const resultItem = (item.type === "user connected")
      ? {
        message: `подключился ${getUserName(item.content)}`,
        name: getUserName(item.user_id) || 'Anonymous',
        time: `${new Date().getHours()}:${new Date().getMinutes()}`,
        userId: item.user_id,
        isMy: false
      }
      : {
        message: item.content,
        name: getUserName(item.user_id) || 'Anonymous',
        time: getHours(item.time),
        userId: item.user_id,
        isMy: store.state.userInfo.id === item.user_id
      }
    resultList.push(resultItem)
  })
  return resultList
}

const buttonAdd = new Button({text: 'Добавить'});
const buttonDel = new Button({text: 'Удалить'});
const buttonCreateChat = new Button({text: 'Создать чат'});
const searchPanel = {
  label: 'Поиск',
  type: 'text',
  name: 'search',
  idErrorElement: 'error-search',
  idInput: 'search',
  dataset: 'data-type=name',
};
const messegeInput = {
  label: 'Сообщение',
  type: 'text',
  name: 'message',
  idErrorElement: 'error-message',
  idInput: 'message',
  dataset: 'data-type=message',
};
const dataPopup = [
  {
    formName: 'addUser',
    title: 'Добавить пользователя',
    name: 'loginAdd',
    idInput: 'loginAdd',
    type: 'text',
    className: 'popupFormAddUser popupForm form popup',
    button: buttonAdd.render(),
    idErrorElement: 'error-loginAdd',
    dataset: 'data-type=name',
    label: 'Логин',
  },
  {
    formName: 'removeUser',
    title: 'Удалить пользователя',
    name: 'loginDel',
    idInput: 'loginDel',
    type: 'text',
    className: 'popupFormRemoveUser popupForm form popup',
    button: buttonDel.render(),
    idErrorElement: 'error-loginDel',
    dataset: 'data-type=name',
    label: 'Логин',
  },
  {
    formName: 'createChat',
    title: 'Название чата:',
    name: 'createChat',
    idInput: 'createChat',
    type: 'text',
    className: 'popupCreateChat popupForm form popup',
    button: buttonCreateChat.render(),
    idErrorElement: 'error-createChat',
    dataset: 'data-type=text',
    label: 'Название чата',
  },
];

const dataForChatPage = () => {
  return {
    dataPopup,
    searchPanel,
    messegeInput,
    users: store.state.users,
    username: store.state.userInfo.first_name,
    avatar: store.state.userInfo.avatar,
    chatsList: store.state.chatsList,
    activeChat: store.state.activeChat,
    messageList: buildMessageList(store.state.messageStore)
  };
};

export {dataForChatPage};
