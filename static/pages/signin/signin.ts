import { Iprops } from '../../service/Block/block';
import { FormValidator } from '../../service/formValidator';
import { signinTmpl } from './signin.tmpl';
import { dataSigninPage } from './constants';
import { userApi } from '../../index';
import { LoginPage } from '../login/login';
import { historyPush } from '../../service/utils';
import { mutationsEnum } from '../../store/mutations';
import store from '../../store/index';

const signinProps = (): Iprops => {
  return {
    root: 'root',
    template: signinTmpl,
    data: dataSigninPage,
  };
};

const signinPage = new LoginPage(signinProps, setValidator);

function submit(obj: { [key: string]: string }) {
  const data = {
    first_name: obj.first_name,
    second_name: obj.second_name,
    login: obj.login,
    email: obj.email,
    password: obj.password,
    phone: obj.phone,
  };
  userApi.createNewUser(data).then(res => {
    const status = (res as { [key: string]: any }).status;
    const response = (res as { response: any }).response;
    if (status === 409) {
      const blockWarningMessage = signinPage
        .getContent()
        ?.querySelector('.form__response-block');
      if (blockWarningMessage) {
        blockWarningMessage.textContent = 'Такой логин уже используется.';
        blockWarningMessage.classList.add('form__response-block_visible');
      }
    } else if (status === 200) {
      store.dispatch(mutationsEnum.setAuth, true);
      historyPush('/chat');
      userApi.getUserInfo();
    } else {
      console.log('Ошибка авторизации: ', status, response);
    }
  });
}

const historyPushLogin = (event: Event) => {
  event.preventDefault();
  historyPush('/login');
};

function setValidator() {
  signinPage.addListener('.form__link_login', 'click', historyPushLogin);
  const elementSigninPage = signinPage.getContent();
  const form: HTMLFormElement | null | undefined =
    elementSigninPage?.querySelector('#signinForm');
  const formValidatorSignin = form ? new FormValidator(form, submit) : null;
  if (formValidatorSignin) {
    signinPage.outSourcesListeners({
      removeListener: formValidatorSignin.removeEventListeners,
      setListener: formValidatorSignin.setEventListeners,
    });
  }
}

export { signinPage };
