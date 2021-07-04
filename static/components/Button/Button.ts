import { Block } from '../../service/Block/block';

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

export { Button };
