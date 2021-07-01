import '../../test'
import {expect} from 'chai';
import {Block} from "./block";

class Button extends Block {
  static OPTIONS = {
    TEMPLATE: `<button class="form__button buttonPrimary"><%-text%></button>`,
    CLASSES: ['form__button', 'buttonPrimary'],
  };

  constructor(props: { root?: string; text: string }) {
    super(() => ({
      root: props.root ? props.root : undefined,
      template: Button.OPTIONS.TEMPLATE,
      data: {text: props.text},
    }));
  }

  render() {
    return this.template();
  }
}

// const button = new Button({root: '.root', text: 'Кнопка'})

describe('test Block', () => {

  it('создаем компонент кнопки', () => {
    const button: Button = new Button({ root: 'root', text: 'Кнопка' });
    const $button = button.getContent();
    expect($button?.textContent).to.equal('Кнопка');
  })
})