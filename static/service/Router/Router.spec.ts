import {Router} from "./Router";
import {expect} from 'chai';
import {JSDOM} from 'jsdom';
import {Block} from "./Router";
import {pageError500} from "../../pages/pageError/pageError";

const globalAny: any = global;
declare global {
  namespace NodeJS {
    interface Global {
      document: Document;
      window: Window;
      navigator: Navigator;
    }
  }
}

let testBlock: Block;
let testBlock2: Block;
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

    class mockBlock {
      element: null | HTMLDivElement;
      className: string;
      text: string;

      constructor(className: string, text: string) {
        this.className = className;
        this.text = text;
        this.element = null;
        this.render()
      }

      leave() {
        if (this.element) this.element.remove()
        this.element = null;
      }

      render() {
        this.element = document.createElement('div')
        this.element.className = this.className
        this.element.textContent = this.text
        if (this.element) document.querySelector('.root')?.prepend(this.element);
      }

      remove() {
        if (this.element) this.element.remove()
        this.element = null;
      }
    }

    testBlock = new mockBlock('test', 'TEST')
    testBlock2 = new mockBlock('test2', 'TEST2')
  });
  it('запускаем router. Должен монтироваться элемент в DOM', () => {
    const router = new Router('.root')
    router.use('/', testBlock);
    router.use('/test2', testBlock2);
    router.start();
    const findElement = document.querySelector('.test')
    expect(findElement?.textContent).to.equal('TEST');
  })

  it('переход с / на /test2 при этом меняется элемент в DOM', () => {
    window.onpopstate = () => console.log('REDIRECT')
    window.addEventListener('onpopstate', () => console.log('SDFDFS'))
    const router = new Router('.root')
    router.use('/', testBlock);
    router.use('/test2', testBlock2);
    router.addRedirect('/test4', '/test2', () => true);
    router.start();
    router.go('/test2')
    const findElement = document.querySelector('.test2')
    expect(findElement?.textContent).to.equal('TEST2');
    expect(findElement?.className.length).to.equal(5)
    expect(window.location.pathname).to.equal('/test2')

    router.go('/test3')
    expect(window.location.pathname).to.equal('/test3')

    router.go('/test4')

    console.log(window.location.pathname)

  })

  it('монтируем настоящий блок', () => {
    const router = new Router('.root')
    router.use('/error500', pageError500);
    router.go('/unknown')
    const findElement = document.querySelector('.pageErrorMessage')
    expect(findElement?.className).to.equal('pageErrorMessage')
  })
})