import { xhr } from '../XHR';
import store from '../../store/index';
import { mutationsEnum } from '../../store/mutations';

class ChatApi {
  URL: string;
  headers: { [key: string]: string };

  constructor() {
    this.URL = 'https://ya-praktikum.tech/api/v2';
    this.headers = { 'Content-Type': 'application/json' };
  }

  createNewChat(data: { title: string }) {
    const path = '/chats';
    return xhr.post(`${this.URL}${path}`, { data, headers: this.headers });
    // вернётся: {"id": number}
  }

  _getChats() {
    const path = '/chats?offset=0&limit=10';
    return xhr.get(`${this.URL}${path}`, {
      headers: { accept: 'application/json' },
    });
    /* возвращатеся [
       {
         "id": number,
         "title": "string",
         "created_by": number
       },
       .....
     ] */
  }

  getChats() {
    return this._getChats()
      .then(res => {
        const status = (res as { [key: string]: any }).status;
        const response = JSON.parse((res as { response: any }).response);
        if (status === 200) {
          store.dispatch(mutationsEnum.setChats, response);
          setTimeout(this.getChatUsersByActiveChat, 0)
        } else {
          console.log('Ошибка при запросе: ', status);
        }
        return response;
      })
      .catch(e => console.log('Ошибка при запросе: ', e));
  }

  getChatUsersByActiveChat() {
    const activeChatId = store?.state?.activeChat
    if (activeChatId) {
      chatApi.getChatUsers(activeChatId)
        .then(response => {
          store.dispatch(mutationsEnum.setChatUsers, response);
        })
    }
  }

  searchUserByLogin(login: string) {
    const path = '/user/search';
    return xhr.post(`${this.URL}${path}`, {
      data: { login },
      headers: this.headers,
    });
    /*
            [{
                "id": number,
                "first_name": "string",
                "second_name": "string",
                "display_name": string,
                "login": "string",
                "avatar": string,
                "email": "string",
                "phone": "string"
            }, ... ]
        */
  }

  addUserToChat(data: { users: (string | number)[]; chatId: string | number }) {
    const path = '/chats/users';
    return xhr.put(`${this.URL}${path}`, { data, headers: this.headers });
  }

  deleteUserChat(data: { users: number[]; chatId: number }) {
    const path = '/chats/users';
    return xhr.delete(`${this.URL}${path}`, { data, headers: this.headers });
  }

  _getChatUsers(id: number | string) {
    const path = `/chats/${id}/users`;
    return xhr
      .get(`${this.URL}${path}`, { headers: { accept: 'application/json' } })
      .then(response => {
        const status = (response as Response).status;
        if (status === 200) {
          return JSON.parse((response as { [key: string]: any })?.response);
        } else {
          console.log('Ошибка при запросе: ', status)
        }
      })
      .catch(e => console.log(e));
  }

  getChatUsers(id: number | string) {
    return this._getChatUsers(id);
  }

}

const chatApi = new ChatApi();

export { chatApi };
