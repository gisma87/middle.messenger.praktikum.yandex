import { formatValidate, errorMessages } from './utils';

interface IformatValidate {
  [key: string]: {
    inputName: string;
    regexp: RegExp;
  };
}

type Listeners = {
  targetElement: HTMLElement | HTMLElement[];
  event: string;
  callback: (event: Event) => void;
}[];

class FormValidator {
  form: HTMLElement;
  listeners: Listeners;
  errorMessages: { [key: string]: string };
  formatValidate: IformatValidate;
  inputs: HTMLInputElement[];
  callback: ((obj: { [key: string]: string }) => void) | undefined;

  constructor(
    form: HTMLElement,
    callback?: (obj: { [key: string]: string }) => void,
  ) {
    this.form = form;
    this.callback = callback;
    this.errorMessages = errorMessages;
    this.formatValidate = formatValidate;
    this.inputs = Array.from(this.form.getElementsByTagName('input'));
    this.formSubmit = this.formSubmit.bind(this);
    this.formBlur = this.formBlur.bind(this);
    this.formFocus = this.formFocus.bind(this);
    this.setEventListeners = this.setEventListeners.bind(this);
    this.removeEventListeners = this.removeEventListeners.bind(this);
    this.listeners = [
      { targetElement: this.form, event: 'submit', callback: this.formSubmit },
      { targetElement: this.inputs, event: 'blur', callback: this.formBlur },
      { targetElement: this.inputs, event: 'focus', callback: this.formFocus },
    ];
  }

  resetError(errorElement: Element) {
    errorElement.textContent = '';
  }

  checkInputValidity(element: HTMLInputElement) {
    const errorElement = this.form.querySelector(`#error-${element.id}`);
    const keysInputType = Object.keys(this.formatValidate);
    const inputName = keysInputType.find(item => item === element.dataset.type);
    const value = String(element.value);

    if (element && element.getAttribute('type') === 'file') {
      if (!element.value.length && Boolean(element.getAttribute('required'))) {
        if (errorElement) {
          errorElement.classList.add('form__errorMessage_visible');
        }
        return false;
      }
      return true;
    }

    const regexp = inputName
      ? this.formatValidate[inputName]?.regexp
      : new RegExp('.*');
    const isValid = !!value.match(regexp);
    if (errorElement) {
      if (!isValid) {
        if (element.dataset.error !== 'border') {
          if (!value.length) {
            errorElement.textContent = errorMessages.valueMissing;
          }
          if (value.length < 2 || value.length > 30) {
            errorElement.textContent = errorMessages.tooShort;
          } else {
            errorElement.textContent = errorMessages.typeMismatch;
          }
          if (element.dataset.type === 'password') {
            errorElement.textContent = errorMessages.password;
          }
        }
        errorElement.classList.add('form__errorMessage_visible');
        return isValid;
      }
      if (element.dataset.type === 'repeatpassword') {
        const newPassword: HTMLInputElement | null =
          this.form.querySelector('#new-password');
        if (newPassword && newPassword.value !== element.value) {
          errorElement.classList.add('form__errorMessage_visible');
          if (element.dataset.error !== 'border') {
            errorElement.textContent = errorMessages.repeatPassword;
          }
          return false;
        }
      }
      if (element.dataset.error !== 'border') this.resetError(errorElement);
      errorElement.classList.remove('form__errorMessage_visible');
    }
    return isValid;
  }

  checkFormValidity(form = this.form) {
    const inputs = Array.from(form.getElementsByTagName('input'));
    let isValidForm = true;
    inputs.forEach(elem => {
      if (!this.checkInputValidity(elem)) isValidForm = false;
    });
    return isValidForm;
  }

  formSubmit(event: Event) {
    console.log('FormSubmit');
    event.preventDefault();
    if (this.checkFormValidity()) {
      const formData = {};
      let typeFile = false;
      this.inputs.forEach(input => {
        if (input.type === 'file') {
          // @ts-ignore
          const obj = this.inputs[0].files[0];
          const formData = new FormData();
          formData.append('avatar', obj);
          // @ts-ignore
          this.callback(formData);
          typeFile = true;
        } else {
          // @ts-ignore
          formData[input.id] = input.value;
        }
      });
      if (this.callback && !typeFile) this.callback(formData);
    }

    // // @ts-ignore
    // const obj = this.inputs[0].files[0]
    // const formData = new FormData();
    // formData.append("avatar", obj);
    // // @ts-ignore
    // this.callback(formData)
  }

  formBlur(event: Event) {
    this.checkInputValidity(<HTMLInputElement>event.target);
  }

  formFocus(event: Event) {
    const elem = event.target;
    if (elem instanceof HTMLInputElement) {
      const errorElement = this.form.querySelector(`#error-${elem.id}`);
      if (errorElement && elem.dataset.error !== 'border') {
        errorElement.textContent = '';
      }
      errorElement?.classList.remove('form__errorMessage_visible');
    }
  }

  setEventListeners() {
    this.listeners.forEach(listeners => {
      if (listeners.targetElement instanceof Array) {
        listeners.targetElement.forEach(elem => {
          elem.addEventListener(listeners.event, listeners.callback);
        });
      } else {
        listeners.targetElement.addEventListener(
          listeners.event,
          listeners.callback,
        );
      }
    });
  }

  removeEventListeners() {
    this.listeners.forEach(listeners => {
      if (listeners.targetElement instanceof Array) {
        listeners.targetElement.forEach(elem => {
          elem.removeEventListener(listeners.event, listeners.callback);
        });
      } else {
        listeners.targetElement.removeEventListener(
          listeners.event,
          listeners.callback,
        );
      }
    });
  }
}

export { FormValidator };
