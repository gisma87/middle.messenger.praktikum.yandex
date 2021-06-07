import { Block, Iprops } from '../../service/block';
import { Popup } from '../../service/popup';
import { InputTypeFile } from '../../service/InputTypeFile';
import { FormValidator } from '../../service/formValidator';
import { userApi } from '../../index';
import { profileTmpl } from './profile.tmpl';
import { dataForProfilePage } from './constants';
import { historyPush } from '../../service/utils';
import store from '../../store/index';
import { mutationsEnum } from '../../store/mutations';

const profileProps = () => {
  return {
    root: 'root',
    template: profileTmpl,
    data: dataForProfilePage(),
    store: store,
    callbackAfterRender: setValidator,
  };
};

class Profile extends Block {
  removeOutSourcesListeners: (() => void)[];
  setOutSourcesListeners: (() => void)[];
  popups: Popup | undefined;

  setPopup: () => Popup;
  callbackAfterRender: () => void;

  constructor(props: () => Iprops, setPopup: () => Popup) {
    super(props);

    this.removeOutSourcesListeners = [];
    this.setOutSourcesListeners = [];
    this.setPopup = setPopup;
    this.callbackAfterRender = this.props.callbackAfterRender
      ? this.props.callbackAfterRender
      : () => {};
  }

  componentDidMount() {
    this.popups = this.setPopup();
    this.callbackAfterRender();
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

  render() {
    super.render();
    if (this.setOutSourcesListeners.length) {
      this.setOutSourcesListeners.forEach(callbacks => callbacks());
    }
  }

  remove() {
    if (this.removeOutSourcesListeners) {
      this.removeOutSourcesListeners.forEach(removeListener =>
        removeListener(),
      );
    }
    this.setOutSourcesListeners = [];
    this.removeOutSourcesListeners = [];
    super.remove();
  }
}

const historyPushChats = (event: Event) => {
  event.preventDefault();
  historyPush('/');
};

const historyPushChangeData = (event: Event) => {
  event.preventDefault();
  historyPush('/profileChangeData');
};

const historyPushChangePassword = (event: Event) => {
  event.preventDefault();
  historyPush('/profileChangePassword');
};

const profile = new Profile(profileProps, setPopup);
profile.addListener('.profile__btnBack', 'click', historyPushChats);
profile.addListener('.profile__btnChangeData', 'click', historyPushChangeData);
profile.addListener(
  '.profile__btnChangePassword',
  'click',
  historyPushChangePassword,
);
profile.addListener('.profile__logout', 'click', logoutFetch);

const logout = () => {
  window.sessionStorage.clear();
  store.dispatch(mutationsEnum.setAuth, false);
  historyPush('/login');
};

function logoutFetch() {
  userApi
    .logout()
    .then(() => {
      logout();
    })
    .catch(e => console.log('Error: ', e));
}

function setPopup() {
  const backdrop: HTMLElement | null = document.querySelector('.backdrop');
  const buttonDownload: HTMLElement | null = document.querySelector(
    '.profile__btnDownload',
  );
  const popupFormDownload: HTMLElement | null =
    document.querySelector('.popupFormDownload');
  const statePopup: {
    button: HTMLElement | null;
    popup: HTMLElement | null;
    backDropDark?: boolean;
  }[] = [
    { button: buttonDownload, popup: popupFormDownload, backDropDark: true },
  ];

  const popups = new Popup(statePopup, backdrop);
  profile.outSourcesListeners({
    removeListener: popups.removeEventListeners,
    setListener: popups.setEventListeners,
  });

  return popups;
}

function setValidator() {
  function submit(obj: { [key: string]: any }) {
    userApi
      .setAvatar(obj)
      .then(res => {
        const status = (res as { [key: string]: any }).status;
        if (status === 200) {
          profile.popups?.removeClassActivePopup();
          userApi.getUserInfo();
        }
        if (status !== 200) {
          console.log('Ошибка запроса: ', status);
        }
      })
      .catch(e => console.log('Ошибка запроса: ', e));
  }

  // для input type='file'
  const formTitle: HTMLElement | null = document.querySelector('.form__title');
  const fileContainer: HTMLElement | null = document.querySelector(
    '.form__fileContainer',
  );
  const fileTitle: HTMLElement | null =
    document.querySelector('.form__fileTitle');
  const labelFile: HTMLElement | null =
    document.querySelector('.form__labelFile');
  const imgDeleteBtn: HTMLElement | null = document.querySelector(
    '.form__imgDeleteBtn',
  );
  const inputFile: HTMLInputElement | null = document.querySelector('#fileAdd');
  const errorMessage: HTMLElement | null = document.querySelector(
    '.profile__errorMessagePopup',
  );

  const propsInputTypeFile = {
    formTitle,
    fileContainer,
    fileTitle,
    labelFile,
    imgDeleteBtn,
    inputFile,
    errorMessage,
  };
  new InputTypeFile(propsInputTypeFile);

  // валидируем форму с InputTypeFile
  const form: HTMLElement | null = document.querySelector('#addFileForPhoto');
  const formValidator = form ? new FormValidator(form, submit) : null;

  if (formValidator) {
    profile.outSourcesListeners({
      removeListener: formValidator.removeEventListeners,
      setListener: formValidator.setEventListeners,
    });
  }
}

export { profile };
