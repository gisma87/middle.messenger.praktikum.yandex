import {Block, Iprops} from '../../service/Block/block';
import {FormValidator} from '../../service/formValidator';
import {profileChangeDataTmpl} from './profileChangeData.tmpl';
import {profileChangeDataPage} from './constants';
import {historyPush} from '../../service/utils';
import {userApi} from '../../index';

type profileData = {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
};

const propsProfileData = () => {
  return {
    root: 'root',
    template: profileChangeDataTmpl,
    data: profileChangeDataPage(),
  };
};

class ProfileChangeData extends Block {
  setValidator: () => FormValidator | null;
  validator: FormValidator | undefined | null;

  constructor(props: () => Iprops, setValidator: () => FormValidator | null) {
    super(props);
    this.setValidator = setValidator;
  }

  componentDidMount() {
    this.validator = this.setValidator();
    if (this.validator) this.validator.setEventListeners();
  }

  componentDidUpdate() {
    this.validator = this.setValidator();
    if (this.validator) this.validator.setEventListeners();
  }

  removeEventListener() {
    if (this.validator) this.validator.removeEventListeners();
  }
}

const historyPushChats = (event: Event) => {
  event.preventDefault();
  historyPush('/');
};

const profileChangeData = new ProfileChangeData(propsProfileData, setValidator);
profileChangeData.addListener('.profile__btnBack', 'click', historyPushChats);

function submit(obj: { [key: string]: string }) {
  userApi.changeProfileData(obj as profileData);
}

function setValidator(): FormValidator | null {
  const elementChangeData = profileChangeData.getContent();
  const form: HTMLFormElement | null | undefined =
    elementChangeData?.querySelector('#formChangeData');
  return form ? new FormValidator(form, submit) : null;
}

export {profileChangeData};
