import { Button } from '../../components/Button/Button';
import store from '../../store/index';

const buttonAdd = new Button({ text: 'Добавить' });
const buttonDel = new Button({ text: 'Удалить' });
const buttonCreateChat = new Button({ text: 'Создать чат' });
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
  };
};

export { dataForChatPage };
