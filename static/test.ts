import { JSDOM } from 'jsdom';

const { window } = new JSDOM(
  `<html lang="ru">
    <head>
      <meta charset="UTF-8" />
      <title>messenger</title>
    </head>
    <body>
      <div class="root"></div>
    </body>
  </html>`,
  { url: 'http://localhost' },
);

const globalAny: any = global;
globalAny.window = window;
globalAny.document = window.document;
global.HTMLElement = window.HTMLElement;