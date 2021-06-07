import { Button } from '../../components/Button/Button';

interface dataInput {
  [key: string]: string | object | undefined;
}

const dataInputs: dataInput[] = [
  {
    label: 'Логин',
    type: 'text',
    name: 'login',
    idErrorElement: 'error-login',
    idInput: 'login',
    dataset: 'data-type=name',
  },
  {
    label: 'Пароль',
    type: 'password',
    name: 'password',
    idErrorElement: 'error-password',
    idInput: 'password',
    dataset: 'data-type=password',
  },
];
const button = new Button({ text: 'Авторизоваться' });
const dataLoginPage = () => ({
  dataInputs,
  formName: 'login',
  title: 'Вход',
  button: button.render(),
});

export { dataLoginPage };
