# @quitsmx/fullscrn

[![npm Version][npm-badge]][npm-url]
[![License][license-badge]][license-url]
[![Bundle Size][size-badge]][size-url]
[![Typings][types-badge]][types-url]

Simple wrapper for cross-browser usage of the JavaScript [Fullscreen API](https://developer.mozilla.org/en/DOM/Using_full-screen_mode), which lets you bring the page or any element into fullscreen. Smoothens out the browser implementation differences, so you don't have to.

> **This package is based on on Sindre Sorhus' screenfull.**

## Install

```bash
yarn add @quitsmx/fullscrn
# or npm
npm i @quitsmx/fullscrn -S
```

### Import

```js
// CommonJS (node)
const { fullscrn } = require('@quitsmx/fullscreen')

// ES module
import { fullscrn } from '@quitsmx/fullscreen'
```

## Why

Size.

TL;DR

Sindre Sorhus's [screenfull.js package](https://github.com/sindresorhus/screenfull.js) is excelent, as is Rafael Pedicini's [fscreen](https://github.com/rafgraph/fscreen), but we don't need support for old browsers, nor do we wanna write code to exclude unsupported browsers.

This package is for ES2018 browsers (and Safari 10+ in Mac/iPad) and does not require conditionals to exclude unsupported browsers or devices, such as the iPhone.

**Note:** The lack of iPhone support is a limitation in the browser, not in this package.

## Examples

### Fullscreen the page

```js
document.getElementById('button-id').addEventListener('click', () => {
  fullscrn.request()
})
```

### Fullscreen an element

```js
document.getElementById('button-id').addEventListener('click', evt => {
  fullscrn.request(evt.currentTarget.parentElement)
})
```

### Hide navigation user-interface on mobile devices

```js
document.getElementById('button-id').addEventListener('click', evt => {
  fullscrn.request(evt.currentTarget.parentElement, { navigationUI: 'hide' })
})
```

### Toggle fullscreen on a image with jQuery

```js
$('img').on('click', evt => {
  fullscrn.toggle(evt.target)
})
```

### Detect fullscreen changes

```js
const remover = fullscrn.onchange(() => {
  console.log('Am I fullscreen?', fullscrn.isFullscreen ? 'Yes' : 'No')
})

// Later, you can remove the listener by calling `remover`
remover()
```

#### Detect fullscreen changes in a React FC

Note: The removal of the listener is automatic if you return the result of the
`onchange` method to the `useEffect` hook.

```jsx
useEffect(
  () =>
    fullscrn.onchange(() => {
      console.log('Am I fullscreen?', fullscrn.isFullscreen ? 'Yes' : 'No')
    }),
  []
)
```

#### Detect fullscreen error

```js
/**
 * Register the error handler with onerror and store the result (`remover`).
 * Later, you can remove the listener by calling `remover()`.
 */
const remover = fullscrn.onerror(evt => {
  console.error('Failed to enable fullscreen', evt)
})
```

## API

### `request(element?: Element, options?: FullscreenOptions) => Promise<void>`

Make an element fullscreen.

Accepts a DOM element and [`FullscreenOptions`](https://developer.mozilla.org/en-US/docs/Web/API/FullscreenOptions).

The default element is `<html>`. If called with another element than the currently active, it will switch to that if it's a decendant.

If your page is inside an `<iframe>` you will need to add a `allowfullscreen` attribute (+ `webkitallowfullscreen` and `mozallowfullscreen`).

Keep in mind that the browser will only enter fullscreen when initiated by user events like click, touch, key.

Returns a promise that resolves after the element enters fullscreen.

### `exit() => Promise<void>`

Brings you out of fullscreen.

Returns a promise that resolves after the element exits fullscreen.

### `toggle(element?: Element, options?: FullscreenOptions) => Promise<void>`

Requests fullscreen if not active, otherwise exits.

Accepts a DOM element and [`FullscreenOptions`](https://developer.mozilla.org/en-US/docs/Web/API/FullscreenOptions).

Returns a promise that resolves after the element enters/exits fullscreen.

### `onchange(EventListener) => function`

Add a listener for when the browser switches in and out of fullscreen.

Returns a function that removes the event listener.

### `onerror(EventListener) => function`

Add a listener for when there is an error.

Returns a function that removes the event listener.

### `element: Element | null`

Readonly property that returns the element currently in fullscreen, otherwise `null`.

### `isFullscreen: boolean`

Readonly property that indicates whether fullscreen is active.

### `isEnabled: boolean`

Readonly property that indicates whether you are allowed to enter fullscreen.
If your page is inside an `<iframe>` you will need to add a `allowfullscreen` attribute (+ `webkitallowfullscreen`).

## FAQ

### How can I navigate to a new page when fullscreen?

That's not supported by browsers for security reasons. There is, however, a dirty workaround. Create a seamless iframe that fills the screen and navigate to the page in that instead.

```js
document.getElementById('new-page-btn').addEventListener('click', () => {
  const iframe = document.createElement('iframe')

  iframe.setAttribute('id', 'external-iframe')
  iframe.setAttribute('src', 'https://new-page-website.com')
  iframe.setAttribute('frameborder', 'no')
  iframe.style.position = 'absolute'
  iframe.style.top = '0'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.left = '0'

  document.body.prepend(iframe)
  document.body.style.overflow = 'hidden'
})
```

### Why named export?

Because _Intellisense_.

But if you don't like it, just re-export as `default` in any file...

```ts
export { fullscrn as default } from '@quitsmx/fullscrn'
```

and use it:

```ts
import fullscrn from './fullscrn'
```

## Resources

- [Using the Fullscreen API in web browsers](https://hacks.mozilla.org/2012/01/using-the-fullscreen-api-in-web-browsers/)
- [MDN - Fullscreen API](https://developer.mozilla.org/en/DOM/Using_full-screen_mode)
- [W3C Fullscreen spec](https://fullscreen.spec.whatwg.org/)
- [Building an amazing fullscreen mobile experience](https://developers.google.com/web/fundamentals/native-hardware/fullscreen/)

## License

The [MIT License](LICENSE) &copy; 2021 by QuITS

[license-badge]: https://badgen.net/npm/license/@quitsmx/fullscrn
[license-url]: https://github.com/quitsmx/fullscrn/blob/master/LICENSE
[npm-badge]: https://badgen.net/npm/v/@quitsmx/fullscrn
[npm-url]: https://www.npmjs.com/package/@quitsmx/fullscrn
[size-badge]: https://badgen.net/bundlephobia/minzip/@quitsmx/fullscrn
[size-url]: https://bundlephobia.com/result?p=@quitsmx/fullscrn
[types-badge]: https://badgen.net/npm/types/tslib
[types-url]: https://github.com/quitsmx/fullscrn
