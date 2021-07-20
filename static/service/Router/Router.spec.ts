import {Router} from "./Router";
import {expect, assert} from 'chai';
import {JSDOM} from 'jsdom';
import {Block} from "./Router";

const globalAny: any = global;
// declare global {
//   namespace NodeJS {
//     interface Global {
//       document: Document;
//       window: Window;
//       navigator: Navigator;
//     }
//   }
// }

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
    const router = new Router('.root')
    router.use('/', testBlock);
    router.use('/test2', testBlock2);
    router.start();
    router.go('/test2')
    const findElement = document.querySelector('.test2')
    expect(findElement?.textContent).to.equal('TEST2');
    assert.equal(findElement?.className.length, 7)
    expect(window.location.pathname).to.equal('/test2')

    router.go('/test3')
    expect(window.location.pathname).to.equal('/test3')
    assert.equal(window.history.length, 3)
  })
})