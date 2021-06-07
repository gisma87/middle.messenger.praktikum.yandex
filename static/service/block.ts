import EventBus from './eventBus';
import {isEqual} from './utils';
import Store from '../store/store';
import cloneDeep from './cloneDeep';
import {stateType} from "../store/typeStore";

export interface Iprops {
  class?: string | string[];
  root?: string;
  template?: string;
  data?: object;
  store?: Store;
  callbackAfterRender?: () => void;

  [key: string]: string | object | undefined | Store;
}

type Listeners = {
  targetSelector: string;
  event: string;
  callback: (event: Event) => void;
}[];
type propsKeys = Extract<keyof Iprops, string>;

class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
    FLOW_RERENDER: 'flow:rerender',
  };
  listeners: Listeners;
  _element: HTMLElement | undefined | null;
  props: Iprops;
  eventBus: EventBus;
  getProps: () => Iprops;
  root: HTMLElement | null;

  constructor(getProps: () => Iprops) {
    this.listeners = [];
    this.getProps = getProps;
    this.props = this._makePropsProxy(getProps());
    const eventBus = new EventBus();

    if (this.props?.store instanceof Store) {
      const store = this.props.store;
      store.events.on('stateChange', ({prevState}) => this.setProps(this.getProps(), prevState));
    }

    this.root = this.props.root
      ? document.querySelector(`.${this.props.root}`)
      : null;
    this.eventBus = eventBus;
    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  _updateProps() {
    this.props = this._makePropsProxy(this.getProps());
  }

  _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RERENDER, this._rerender.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
  }

  _createResources() {
    this._element = this._createDocumentElement();
  }

  init() {
    this._updateProps();
    this._createResources();
  }

  _componentDidMount() {
    this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
    this.setEventListener();
    this.componentDidMount();
  }

  componentDidMount() {
  }

  // @ts-ignore
  shouldComponentUpdate(prevProps: Iprops, prevState?: stateType) {
    return true;
  }

  _componentDidUpdate(prevProps: Iprops, prevState?: stateType) {
    if (this.shouldComponentUpdate(prevProps, prevState)) {
      // если shouldComponentUpdate не запрещает и элемент присутствует на странице то перерисовываем.
      if (this._element) {
        console.log('Обновляем компонент', this);
        this._removeEventListener();
        this.eventBus.emit(Block.EVENTS.FLOW_RERENDER);
        this.setEventListener();
        this.componentDidUpdate(prevProps, prevState);
      }
    }
  }

  // @ts-ignore
  componentDidUpdate(prevProps: Iprops, prevState?: stateType) {
  }

  setProps = (nextProps: Iprops, prevState?: stateType) => {
    if (!nextProps) {
      return;
    }
    const prevProps = cloneDeep(this.props);
    const newProps = Object.assign(this.props, nextProps);
    const isEqualProps = isEqual(prevProps, newProps);

    if(prevState && this.props.store?.state) {
      const isEqualState = isEqual(prevState, this.props.store?.state)
      if (!isEqualProps || !isEqualState) {
        this._componentDidUpdate(prevProps as Iprops, prevState);
      }
    } else {
      if(!isEqualProps) this._componentDidUpdate(prevProps as Iprops);
    }
  };

  get element() {
    return this._element;
  }

  template() {
    // @ts-ignore
    return _.template(this.props.template)(this.props.data);
  }

  _render() {
    const root = this.props.root
      ? document.querySelector(`.${this.props.root}`)
      : null;
    if (root && this._element) {
      root.append(this._element);
    }
  }

  render() {
    this.eventBus.emit(Block.EVENTS.INIT);
    this.eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  _rerender() {
    this._updateProps();
    const element = this._createDocumentElement();
    const childs = element.innerHTML;
    if (this._element) this._element.innerHTML = childs;
  }

  getContent() {
    return this.element;
  }

  _makePropsProxy(props: Iprops) {
    return new Proxy(props, {
      get(target: Iprops, prop: propsKeys) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },

      set(target: Iprops, prop: propsKeys, value) {
        target[prop] = value;
        return true;
      },

      deleteProperty() {
        throw new Error('нет доступа');
      },
    });
  }

  _createDocumentElement(): HTMLElement {
    const elementContainer = document.createElement('div');
    elementContainer.innerHTML = this.template();
    const mainElement = elementContainer.children[0];
    const tagName = mainElement.tagName;
    const classes = mainElement.className;
    const elements = mainElement.innerHTML;
    const element = document.createElement(tagName);
    element.className = classes;
    element.innerHTML = elements;

    return element instanceof HTMLElement ? element : elementContainer;
  }

  remove() {
    if (this._element) {
      this._element.remove();
    }
    this._element = null;
  }

  addListener(
    targetSelector: string,
    event: string,
    callback: (event: Event) => void,
  ) {
    if (this.listeners.length) {
      const isRepeatListener = this.listeners.some(listener => {
        return (
          listener.targetSelector === targetSelector &&
          listener.event === event &&
          listener.callback === callback
        );
      });
      if (isRepeatListener) return;
      this.listeners.push({targetSelector, event, callback});
    } else {
      this.listeners.push({targetSelector, event, callback});
    }
  }

  setEventListener() {
    if (this.listeners.length) {
      this.listeners.forEach(listener => {
        const targetElement: HTMLElement | null | undefined =
          this.element?.querySelector(listener.targetSelector);
        if (targetElement) {
          targetElement.addEventListener(listener.event, listener.callback);
        }
      });
    }
  }

  removeEventListener() {
  }

  _removeEventListener() {
    this.removeEventListener();
    if (this.listeners.length) {
      this.listeners.forEach(listener => {
        const targetElement: HTMLElement | null | undefined =
          this.element?.querySelector(listener.targetSelector);
        if (targetElement) {
          targetElement.removeEventListener(listener.event, listener.callback);
        }
      });
    }
  }
}

export {Block};
