import { Button } from '../../components/Button/Button';

interface dataInput {
  [key: string]: string | object | undefined;
}

const dataInputs: dataInput[] = [
  {
    label: 'Почта',
    type: 'text',
    name: 'mail',
    idErrorElement: 'error-email',
    idInput: 'email',
    dataset: 'data-type=mail',
  },
  {
    label: 'Логин',
    type: 'text',
    name: 'login',
    idErrorElement: 'error-login',
    idInput: 'login',
    dataset: 'data-type=name',
  },
  {
    label: 'Имя',
    type: 'text',
    name: 'first-name',
    idErrorElement: 'error-first_name',
    idInput: 'first_name',
    dataset: 'data-type=name',
  },
  {
    label: 'Фамилия',
    type: 'text',
    name: 'second-name',
    idErrorElement: 'error-second_name',
    idInput: 'second_name',
    dataset: 'data-type=name',
  },
  {
    label: 'Телефон',
    type: 'tel',
    name: 'phone',
    idErrorElement: 'error-phone',
    idInput: 'phone',
    dataset: 'data-type=phone',
  },
  {
    label: 'Пароль',
    type: 'password',
    name: 'password',
    idErrorElement: 'error-password',
    idInput: 'password',
    dataset: 'data-type=password',
  },
  {
    label: 'Пароль (ещё раз)',
    type: 'password',
    name: 'password-repeat',
    idErrorElement: 'error-password-repeat',
    idInput: 'password-repeat',
    dataset: 'data-type=repeatpassword',
  },
];

const button = new Button({ text: 'Зарегистрироваться' });
const dataSigninPage = {
  dataInputs,
  formName: 'signIn',
  title: 'Регистрация',
  button: button.render(),
};

export { dataSigninPage };
