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

global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
