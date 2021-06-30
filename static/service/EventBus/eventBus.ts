interface Ilistener {
  [key: string]: (() => void)[];
}

export default class EventBus {
  public listeners: Ilistener;

  constructor() {
    this.listeners = {};
  }

  on(event: string, callback: (...args: any) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [callback];
    } else {
      this.listeners[event].push(callback);
    }
  }

  off(event: string, callback: () => {}): void {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event] = this.listeners[event].filter(
      listener => listener !== callback,
    );
  }

  emit(event: string, ...args: any[]): void {
    if (!this.listeners[event]) {
      console.log(`Нет события: ${event}`);
      // throw new Error(`Нет события: ${event}`);
      return;
    }

    this.listeners[event].forEach(function (listener) {
      // @ts-ignore
      listener(...args);
    });
  }
}
