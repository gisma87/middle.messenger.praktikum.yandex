import { Block, Iprops } from '../../service/block';
import { errorTmpl } from './pageError.tmpl';

const dataError500 = { text: 'Мы уже фиксим', title: '500' };

const propsPageError = () => ({
  root: 'root',
  template: errorTmpl,
  data: dataError500,
});

class PageError500 extends Block {
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

const pageError500 = new PageError500(propsPageError);

function historyPush(url: string = '/'): void {
  window.history.pushState('', '', url);
  window.history.pushState('', '', url);
  window.history.replaceState('', '', url);
  window.history.back();
  window.history.forward();
}

const historyPushPageError500 = (event: Event) => {
  event.preventDefault();
  historyPush();
};

pageError500.addListener(
  '.pageErrorMessage__link',
  'click',
  historyPushPageError500,
);

export { pageError500 };
