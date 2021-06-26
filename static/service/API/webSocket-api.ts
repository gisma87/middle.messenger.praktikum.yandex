import {xhr} from '../XHR';
import store from '../../store/index';
import {mutationsEnum} from '../../store/mutations';

type messageDataType = {message: string, type?: string, chatID: string | number}

class WebSocketApi {
  URL: string;
  headers: { [key: string]: string };
  socket: WebSocket | null;
  lastMessage: messageDataType | null;

  constructor() {
    this.URL = 'https://ya-praktikum.tech/api/v2';
    this.headers = {'Content-Type': 'application/json'};
    this.socket = null;
    this.lastMessage = null
  }

  _getToken(chatId: string | number) {
    const path = `/chats/token/${chatId}`;
    return xhr.post(`${this.URL}${path}`, {headers: this.headers});
  }

  createSocket(chatId: string | number) {
    if (this.socket) this.socket.close()
    return this._getToken(chatId)
      .then(res => {
        const status = (res as { [key: string]: any }).status;
        const response = JSON.parse((res as { response: any }).response);
        if (status === 200) {
          const token = response.token
          store.dispatch(mutationsEnum.setToken, token);
          setTimeout(() => {
            this._createSocket(token, chatId)
          }, 0)
        } else {
          console.log('Ошибка при запросе: ', status);
        }
        return response;
      })
      .catch(e => console.log('Ошибка при запросе: ', e));
  }

  send({message, type = 'message', chatID}: messageDataType) {
    if (this.socket) {
      this.socket.send(JSON.stringify({
        content: message,
        type: type,
      }))
    } else {
      this.lastMessage = {message, type, chatID}
      this.createSocket(chatID)
    }
  }

  _createSocket(token: string, chatId: string | number) {
    this.socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${store.state.userInfo.id}/${chatId}/${token}`);

    this.socket.addEventListener('open', () => {
      console.log('Соединение установлено');
      this.send({message: '0', type: 'get old', chatID: chatId})
      if(this.lastMessage) this.send(this.lastMessage);
      this.lastMessage = null;
    });

    this.socket.addEventListener('close', event => {
      this.socket = null;
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения');
      }

      console.log(`Код: ${event.code} | Причина: ${event.reason}`);
    });

    this.socket.addEventListener('message', event => {
      console.log('Получены данные', event.data);
      store.dispatch(mutationsEnum.setMessage, JSON.parse(event.data));
    });

    this.socket.addEventListener('error', event => {
      console.log('Ошибка', (event as unknown as { message: string }).message);
    });
  }
}

const webSocketApi = new WebSocketApi();

export {webSocketApi};
