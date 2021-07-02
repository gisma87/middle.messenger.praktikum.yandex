import { Button } from '../../components/Button/Button';
import store from '../../store/index';

const buttonInputTypeFile = new Button({ text: 'Сохранить' });

const profileChangeDataPage = () => {
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
        idErrorElement: 'error-email',
        idInput: 'email',
        dataset: 'data-type=mail',
        dataError: 'data-error=border',
      },
      {
        label: 'Логин',
        type: 'text',
        name: 'login',
        placeholder: store.state.userInfo.login,
        idErrorElement: 'error-login',
        idInput: 'login',
        dataset: 'data-type=name',
        dataError: 'data-error=border',
      },
      {
        label: 'Имя',
        type: 'text',
        name: 'first-name',
        placeholder: store.state.userInfo.first_name,
        idErrorElement: 'error-first_name',
        idInput: 'first_name',
        dataset: 'data-type=name',
        dataError: 'data-error=border',
      },
      {
        label: 'Фамилия',
        type: 'text',
        name: 'second-name',
        placeholder: store.state.userInfo.second_name,
        idErrorElement: 'error-second_name',
        idInput: 'second_name',
        dataset: 'data-type=name',
        dataError: 'data-error=border',
      },
      {
        label: 'Имя в чате',
        type: 'text',
        name: 'nameChat',
        placeholder: store.state.userInfo.display_name,
        idErrorElement: 'error-display_name',
        idInput: 'display_name',
        dataset: 'data-type=name',
        dataError: 'data-error=border',
      },
      {
        label: 'Телефон',
        type: 'text',
        name: 'phone',
        placeholder: store.state.userInfo.phone,
        idErrorElement: 'error-phone',
        idInput: 'phone',
        dataset: 'data-type=phone',
        dataError: 'data-error=border',
      },
    ],
  };
};

export { profileChangeDataPage };
