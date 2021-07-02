import { Button } from '../../components/Button/Button';
import store from '../../store/index';

const buttonInputTypeFile = new Button({ text: 'Поменять' });
const dataInputTypeFile = {
  label: 'Выбрать файл на компьютере',
  type: 'file',
  name: 'message',
  idErrorElement: 'error-fileAdd',
  idInput: 'fileAdd',
  dataset: 'data-type=file',
  dataError: 'data-error=border',
};
// const img =
//   'https://ya-praktikum.tech/api/v2/uploads/f617f007-9338-40cd-be0b-96276fa0933d/photo01.jpg';

const dataForProfilePage = () => {
  return {
    avatar: store.state.userInfo.avatar,
    button: buttonInputTypeFile.render(),
    name: store.state.userInfo.first_name,
    dataLongInputs: [
      {
        label: 'Почта',
        type: 'text',
        name: 'mail',
        placeholder: store.state.userInfo.email,
      },
      {
        label: 'Логин',
        type: 'text',
        name: 'login',
        placeholder: store.state.userInfo.login,
      },
      {
        label: 'Имя',
        type: 'text',
        name: 'first-name',
        placeholder: store.state.userInfo.first_name,
      },
      {
        label: 'Фамилия',
        type: 'text',
        name: 'second-name',
        placeholder: store.state.userInfo.second_name,
      },
      {
        label: 'Имя в чате',
        type: 'text',
        name: 'nameChat',
        placeholder: store.state.userInfo.display_name,
      },
      {
        label: 'Телефон',
        type: 'text',
        name: 'phone',
        placeholder: store.state.userInfo.phone,
      },
    ],
    dataInputTypeFile,
  };
};

export { dataForProfilePage };
