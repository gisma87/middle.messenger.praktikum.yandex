import { Block } from './Block/block';
import { isAuth } from '../index';
import { loginPage } from '../pages/login/login';
import { chats } from '../pages/chat/chat';

class Redirect {
  componentTrue: Block;
  componentFalse: Block;

  constructor(componentTrue: Block, componentFalse: Block) {
    this.componentTrue = componentTrue;
    this.componentFalse = componentFalse;
  }

  render() {
    if (isAuth) {
      this.componentTrue.render();
    } else {
      this.componentFalse.render();
    }
  }

  remove() {
    this.componentTrue.remove();
    this.componentFalse.remove();
  }
}

const redirect = new Redirect(chats, loginPage);

export { redirect };
