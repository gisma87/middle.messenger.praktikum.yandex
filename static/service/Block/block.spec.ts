import {expect} from 'chai';
import {JSDOM} from 'jsdom';
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

const globalAny: any = global;
const {window} = new JSDOM(
  `<html lang="ru">
                <head>
                  <meta charset="UTF-8" />
                  <title>messenger</title>
                </head>
                <body>
                  <div class="root"></div>
                  <div class="backdrop"></div>
                </body>
              </html>`,
  {url: 'http://localhost'},
);

globalAny.document = window.document;
globalAny.window = global.document.defaultView;

describe('test Router', () => {
  beforeEach(() => {

  });
  it('запускаем router. Должен монтироваться элемент в DOM', () => {
    // console.log(button.element)
    // const findElement = document.querySelector('.buttonPrimary')
    // expect(findElement?.textContent).to.equal('Кнопка');
  })

})