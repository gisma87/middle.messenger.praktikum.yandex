import { Button } from '../../components/Button/Button';

const button = new Button({ text: 'Сохранить' });
const dataLongInputs = [
  {
    label: 'Старый пароль',
    type: 'password',
    name: 'oldPassword',
    placeholder: '******',
    idErrorElement: 'error-old-password',
    idInput: 'oldPassword',
    dataset: 'data-type=oldpassword',
    dataError: 'data-error=border',
  },
  {
    label: 'Новый пароль',
    type: 'password',
    name: 'newPassword',
    placeholder: '********',
    idErrorElement: 'error-new-password',
    idInput: 'newPassword',
    dataset: 'data-type=password',
    dataError: 'data-error=border',
  },
  {
    label: 'Повторите новый пароль',
    type: 'password',
    name: 'repeat-password',
    placeholder: '********',
    idErrorElement: 'error-repeat-password',
    idInput: 'repeat-password',
    dataset: 'data-type=repeatpassword',
    dataError: 'data-error=border',
  },
];
const profileChangePasswordPage = { button: button.render(), dataLongInputs };

export { profileChangePasswordPage };
