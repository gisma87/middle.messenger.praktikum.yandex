import '../../test';
import { expect } from 'chai';
import { Block } from './block';

class Button extends Block {
  static OPTIONS = {
    TEMPLATE: `<button class="form__button buttonPrimary"><%-text%></button>`,
    CLASSES: ['form__button', 'buttonPrimary'],
  };

  constructor(props: { root?: string; text: string }) {
    super(() => ({
      root: props.root ? props.root : undefined,
      template: Button.OPTIONS.TEMPLATE,
      data: { text: props.text },
    }));
  }

  render() {
    return this.template();
  }
}

describe('test Block', () => {
  it('создаем компонент кнопки', () => {
    //
    // получая $button мы уже можем убедиться что компонент создан и отрендерен корректно
    const button: Button = new Button({ root: 'root', text: 'Кнопка' });
    const $button = button.getContent();

    expect($button?.textContent).to.equal('Кнопка');

    // БОНУС
    // если ты хочешь компонент дополнительно встроить в дом (зачем?)
    // тогда явно вставляем его в наш текущий контекст - JSDOM
    // так же надо не забыть перед каждым тестом очищать наш - JSDOM (общий для тестов)

    // document.querySelector('.root')?.appendChild($button!);

    // только после этого ищем в доме
    // const findElement = document.querySelector('.buttonPrimary');
    // expect(findElement?.textContent).to.equal('Кнопка');
  });
});
