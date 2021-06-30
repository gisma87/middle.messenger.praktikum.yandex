import { Block, Iprops } from '../../service/Block/block';
import { profileChangePasswordPage } from './constants';
import { FormValidator } from '../../service/formValidator';
import { profileChangePasswordTmpl } from './profileChangePassword.tmpl';
import { historyPush } from '../../service/utils';
import { userApi } from '../../index';

const propsProfileChangePassword = () => {
  return {
    root: 'root',
    template: profileChangePasswordTmpl,
    data: profileChangePasswordPage,
  };
};

class ProfileChangePassword extends Block {
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

  outSourcesListeners(listeners: { [key: string]: () => void } | []) {
    if (listeners instanceof Array) {
      listeners.forEach(item => {
        const { setListener, removeListener }: { [key: string]: () => void } =
          item;
        this.removeOutSourcesListeners.push(removeListener);
        this.setOutSourcesListeners.push(setListener);
      });
    } else {
      const { setListener, removeListener } = listeners;
      this.removeOutSourcesListeners.push(removeListener);
      this.setOutSourcesListeners.push(setListener);
    }
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
    if (this.removeOutSourcesListeners) {
      this.removeOutSourcesListeners.forEach(removeListener =>
        removeListener(),
      );
    }
    super.remove();
  }
}

const profileChangePassword = new ProfileChangePassword(
  propsProfileChangePassword,
  setValidator,
);

const historyPushChats = (event: Event) => {
  event.preventDefault();
  historyPush('/');
};

function setValidator() {
  function submit(obj: { [key: string]: string }) {
    console.log('submit changePassword: ', obj);
    userApi
      .changePassword(
        obj as {
          oldPassword: 'string';
          newPassword: 'string';
        },
      )
      .then(res => {
        const status = (res as { [key: string]: any }).status;
        const text = (res as { text: any }).text;
        if (status === 200) {
          historyPush('/');
        } else {
          console.log('Ошибка авторизации: ', status, text);
        }
      })
      .catch(e => console.log('Ошибка авторизации: ', e));
  }

  profileChangePassword.addListener(
    '.profile__btnBack',
    'click',
    historyPushChats,
  );

  const elementChangePassword = profileChangePassword.getContent();
  const form: HTMLElement | null | undefined =
    elementChangePassword?.querySelector('#formChangePassword');
  const formValidatorChangePassword = form
    ? new FormValidator(form, submit)
    : null;
  if (formValidatorChangePassword) {
    profileChangePassword.outSourcesListeners({
      removeListener: formValidatorChangePassword.removeEventListeners,
      setListener: formValidatorChangePassword.setEventListeners,
    });
  }
}

export { profileChangePassword };
