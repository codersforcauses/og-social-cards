import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const mono = readFileSync(
  `${__dirname}/../_fonts/IBMPlexMono-Medium.woff2`
).toString('base64');

function getCss(theme: string, fontSize: string) {
  let background = 'white';
  let foreground = 'black';

  if (theme === 'dark') {
    background = 'black';
    foreground = 'white';
  }
  return `
    @font-face {
        font-family: 'IBM Plex Mono';
        font-style: normal;
        font-weight: 500;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: ${background};
        height: 100vh;
        display: flex;
        align-items: center;
        padding: 100px;
    }

    .logo-wrapper {
        display: flex;
        align-items: flex-start;
        align-content: center;
        justify-content: flex-start;
        justify-items: center;

        position: absolute;
        bottom: 75px;
        left: 114px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }
    
    .heading {
        font-family: 'IBM Plex Mono';
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        font-weight: 500;
        color: ${foreground};
        transform: translate(0, -50%);
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize, images, widths, heights } = parsedReq;
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div class="heading">
            ${emojify(md ? marked(text) : sanitizeHtml(text))}
        </div>
        <div class="logo-wrapper">
            ${images
              .map(
                (img, i) =>
                  getPlusSign(i) + getImage(img, widths[i], heights[i])
              )
              .join('')}
        </div>
    </body>
</html>`;
}

function getImage(src: string, width = '500', height = '225') {
  return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`;
}

function getPlusSign(i: number) {
  return i === 0 ? '' : '<div class="plus">+</div>';
}
