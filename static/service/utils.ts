type PlainObject<T = any> = {
  [k in string]: T;
};

function isArray(value: unknown): value is [] {
  return Array.isArray(value);
}

function isPlainObject(value: unknown): value is PlainObject {
  return (
    typeof value === 'object' &&
    value !== null &&
    value.constructor === Object &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

function isArrayOrObject(value: unknown): value is [] | PlainObject {
  return isPlainObject(value) || isArray(value);
}

function isEqual(lhs: PlainObject, rhs: PlainObject) {
  // Сравнение количества ключей объектов и массивов
  if (Object.keys(lhs).length !== Object.keys(rhs).length) {
    return false;
  }

  for (const [key, value] of Object.entries(lhs)) {
    const rightValue = rhs[key];
    if (isArrayOrObject(value) && isArrayOrObject(rightValue)) {
      if (isEqual(value, rightValue)) {
        continue;
      }
      return false;
    }

    if (value !== rightValue) {
      return false;
    }
  }

  return true;
}

const formatValidate = {
  name: {
    inputName: 'login',
    regexp: new RegExp(
      '^[А-ЯЁA-Z]?[а-яёa-z]{2,}(-[А-ЯЁA-Z]?[а-яёa-z]+)*[0-9]{0,}$',
    ),
  },
  text: { inputName: 'text', regexp: new RegExp('^(.)*?$') },
  mail: {
    inputName: 'email',
    regexp: new RegExp(
      '^(\\w[\\w\\-\\.]+)@(\\w+([\\-\\.]\\w+)?)\\.([a-zA-Z]{2,5})$',
    ),
  },
  phone: {
    inputName: 'phone',
    regexp: new RegExp(
      '^(8|\\+7)((((\\(\\d{3}\\))|(\\s?\\d{3}))[\\s\\-]?\\d{3}-\\d{2}-\\d{2})|\\d{10})$',
    ),
  },
  password: {
    inputName: 'password',
    regexp: new RegExp('^.{4,}$'),
  },
};

const errorMessages = {
  valueMissing: 'Это обязательное поле',
  tooShort: 'Должно быть от 2 до 30 символов',
  typeMismatch: 'Не допустимое значение',
  password: 'Пароль должен быть более 4 символов',
  repeatPassword: 'Пароли не совпадают',
};

function pow(x: number, y: number): number {
  return x ** y;
}

function historyPush(url: string): void {
  window.history.pushState('', '', url);
  window.history.pushState('', '', url);
  window.history.replaceState('', '', url);
  window.history.back();
  window.history.forward();
}

export { pow, isEqual, formatValidate, errorMessages, historyPush };
