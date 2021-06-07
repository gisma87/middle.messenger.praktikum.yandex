import { xhr } from '../XHR';
import { mutationsEnum } from '../../store/mutations';
import Store from '../../store/store';

type profileData = {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
};

class UserApi {
  URL: string;
  imgPath: string;
  headers: { [key: string]: string };
  store: Store;
  rerender: () => void;

  constructor(store: Store, rerender: () => void) {
    this.URL = 'https://ya-praktikum.tech/api/v2';
    this.headers = { 'Content-Type': 'application/json' };
    this.store = store;
    this.imgPath = 'https://ya-praktikum.tech';
    this.rerender = rerender;
  }

  authorization(login: string, password: string) {
    const path = '/auth/signin';
    const data = { login, password };
    const options = { data, headers: this.headers };
    return xhr.post(`${this.URL}${path}`, options);
  }

  createNewUser(data: { [key: string]: string }) {
    const path = '/auth/signup';
    return xhr.post(`${this.URL}${path}`, { data, headers: this.headers });
  }

  logout() {
    const path = '/auth/logout';
    return xhr.post(`${this.URL}${path}`, { headers: this.headers });
  }

  _getUserInfo() {
    const path = '/auth/user';
    return xhr.get(`${this.URL}${path}`, { headers: this.headers });
  }

  _changeProfileData(data: profileData) {
    const path = '/user/profile';
    return xhr.put(`${this.URL}${path}`, { data, headers: this.headers });
  }

  changePassword(data: { oldPassword: 'string'; newPassword: 'string' }) {
    const path = '/user/password';
    return xhr.put(`${this.URL}${path}`, { data, headers: this.headers });
  }

  setAvatar(data: any) {
    const path = '/user/profile/avatar';
    return xhr.put(`${this.URL}${path}`, { data });
  }

  _setUserInfo(userData: { [key: string]: any }) {
    if (userData) {
      // если ссылка на аватар есть - добавляем url для полного пути, иначе заглушку вместо avatar.
      if (userData.avatar) {
        userData.avatar = this.imgPath + userData.avatar;
      } else {
        userData.avatar = this.store.state.userInfo.avatar;
      }
      console.log('userData: ', userData);
      this.store.dispatch(mutationsEnum.setUserInfo, userData);
    }
  }

  getUserInfo() {
    this._getUserInfo()
      .then(res => {
        const status = (res as { [key: string]: any }).status;
        const response = JSON.parse((res as { response: any }).response);
        if (status === 200) {
          this._setUserInfo(response);
        } else {
          this.store.dispatch(mutationsEnum.setAuth, false);
          // дёргаем роутер, чтобы сделал redirect к /login
          this.rerender();
        }
      })
      .catch(() => {
        this.store.dispatch(mutationsEnum.setAuth, false);
        this.rerender();
      });
  }

  changeProfileData(data: profileData) {
    this._changeProfileData(data)
      .then(res => {
        const status = (res as { [key: string]: any }).status;
        const text = (res as { [key: string]: any }).text;
        const response = JSON.parse((res as { response: any }).response);
        if (status === 200) {
          this._setUserInfo(response);
        } else {
          console.log('Ошибка запроса: ', status, text);
        }
      })
      .catch(e => console.log('Ошибка запроса: ', e));
  }
}

export { UserApi };
