import { Block, Iprops } from '../../service/Block/block';
import { FormValidator } from '../../service/formValidator';
import { userApi } from '../../index';
import { loginBlock } from './login.tmpl';
import { dataLoginPage } from './constants';
import { historyPush } from '../../service/utils';

type Listeners = {
  targetSelector: string;
  event: string;
  callback: (event: Event) => void;
}[];

const loginProps = (): Iprops => {
  return {
    root: 'root',
    template: loginBlock,
    data: dataLoginPage(),
  };
};

export class LoginPage extends Block {
  listeners: Listeners;
  removeOutSourcesListeners: (() => void)[];
  setOutSourcesListeners: (() => void)[];
  setValidator: () => void;

  constructor(props: () => Iprops, setValidator: () => void) {
    super(props);

    this.removeOutSourcesListeners = [];
    this.setOutSourcesListeners = [];
    this.listeners = [];
    this.setValidator = setValidator;
  }

  addListener(
    targetSelector: string,
    event: string,
    callback: (event: Event) => void,
  ) {
    if (this.listeners.length) {
      const isRepeatListener = this.listeners.some(listener => {
        return (
          listener.targetSelector === targetSelector &&
          listener.event === event &&
          listener.callback === callback
        );
      });
      if (isRepeatListener) return;
      this.listeners.push({ targetSelector, event, callback });
    } else {
      this.listeners.push({ targetSelector, event, callback });
    }
  }

  outSourcesListeners(listeners: { [key: string]: () => void } | []) {
    if (listeners instanceof Array) {
      listeners.forEach(item => {
        const { setListener, removeListener }: { [key: string]: () => void } =
          item;
        this.removeOutSourcesListeners.push(removeListener);
        this.setOutSourcesListeners.push(setListener);
      });
    } else {
      const { setListener, removeListener }: { [key: string]: () => void } =
        listeners;
      this.removeOutSourcesListeners.push(removeListener);
      this.setOutSourcesListeners.push(setListener);
    }
  }

  setEventListener() {
    this.listeners.forEach(listener => {
      const targetElement: HTMLElement | null | undefined =
        this.element?.querySelector(listener.targetSelector);
      if (targetElement) {
        targetElement.addEventListener(listener.event, listener.callback);
      }
    });
  }

  removeEventListener() {
    this.listeners?.forEach(listener => {
      const targetElement: HTMLElement | null | undefined =
        this.element?.querySelector(listener.targetSelector);
      if (targetElement) {
        targetElement.removeEventListener(listener.event, listener.callback);
      }
    });
  }

  render() {
    super.render();
    this.setValidator();
    this.setEventListener();
    if (this.setOutSourcesListeners.length) {
      this.setOutSourcesListeners.forEach(callbacks => callbacks());
    }
  }

  remove() {
    this.removeEventListener();
    if (this.removeOutSourcesListeners.length) {
      this.removeOutSourcesListeners.forEach(removeListener =>
        removeListener(),
      );
    }
    this.setOutSourcesListeners = [];
    this.removeOutSourcesListeners = [];
    super.remove();
  }
}

const loginPage = new LoginPage(loginProps, setValidator);

function submit(obj: { [key: string]: string }) {
  userApi
    .authorization(obj.login, obj.password)
    .then(res => {
      const status = (res as { [key: string]: any }).status;

      if (status === 200 || status === 400) {
        if (status === 200) {
          historyPush('/chat');
          userApi.getUserInfo();
        } else {
          console.log('Ошибка авторизации: ', status);
        }
      }
      if (status === 401) {
        const blockWarningMessage = loginPage
          .getContent()
          ?.querySelector('.form__response-block');
        if (blockWarningMessage) {
          blockWarningMessage.textContent = 'Неверные логин или пароль.';
          blockWarningMessage.classList.add('form__response-block_visible');
        }
      }
    })
    .catch(e => {
      console.log('Ошибка авторизации: ', e);
    });
}

const historyPushSignin = (event: Event) => {
  event.preventDefault();
  historyPush('/signin');
};

function setValidator() {
  loginPage.addListener('.form__link_signin', 'click', historyPushSignin);

  const elementLoginPage = loginPage.getContent();
  const form: HTMLFormElement | null | undefined =
    elementLoginPage?.querySelector('#loginForm');
  const formValidatorLogin = form ? new FormValidator(form, submit) : null;
  if (formValidatorLogin) {
    loginPage.outSourcesListeners({
      removeListener: formValidatorLogin.removeEventListeners,
      setListener: formValidatorLogin.setEventListeners,
    });
  }
}

export { loginPage };
