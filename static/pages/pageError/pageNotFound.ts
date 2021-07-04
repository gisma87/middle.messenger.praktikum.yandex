import { Block, Iprops } from '../../service/Block/block';
import { errorTmpl } from './pageError.tmpl';
import {historyPush} from "../../service/utils";

const dataError404 = { text: 'Не туда попали', title: '404' };

const propsPageNotFound = () => ({
  root: 'root',
  template: errorTmpl,
  data: dataError404,
});

class PageNotFound extends Block {
  removeOutSourcesListeners: (() => void)[];
  setOutSourcesListeners: (() => void)[];

  constructor(props: () => Iprops) {
    super(props);

    this.removeOutSourcesListeners = [];
    this.setOutSourcesListeners = [];
    this.listeners = [];
    // this.setEventListener()
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
    super.remove();
  }
}

const pageNotFound = new PageNotFound(propsPageNotFound);

const historyPushPageNotFound = (event: Event) => {
  event.preventDefault();
  historyPush('/');
};

pageNotFound.addListener(
  '.pageErrorMessage__link',
  'click',
  historyPushPageNotFound,
);

export { pageNotFound };
