type EventName = 'change' | 'error'
type FullscrnEventHandler = (event: Event) => void
type FullscrnUnsubscribe = () => void

interface Fullscrn {
  /**
   * The element currently in fullscreen, otherwise `null`.
   */
  readonly element: Element | null

  /**
   * Whether fullscreen is active.
   */
  readonly isFullscreen: boolean

  /**
   * Whether you are allowed to enter fullscreen. If your page is inside an
   * `<iframe>` you will need to add a `allowfullscreen` attribute
   * (+ `webkitallowfullscreen`).
   *
   * @example
   *```js
   * if (fullscrn.isEnabled) {
   *   fullscrn.request()
   * }
   *```
   */
  readonly isEnabled: boolean

  /**
   * Make an element fullscreen.
   *
   * If your page is inside an `<iframe>` you will need to add a
   * `allowfullscreen` attribute (+ `webkitallowfullscreen`).
   *
   * Keep in mind that the browser will only enter fullscreen when initiated
   * by user events like click, touch, key.
   *
   * @param element - Default is `<html>`. If called with another element
   *  than the currently active, it will switch to that if it's a decendant.
   * @param options - [`FullscreenOptions`](https://developer.mozilla.org/en-US/docs/Web/API/FullscreenOptions).
   * @returns A promise that resolves after the element enters fullscreen.
   *
   * @example
   *```js
   * // Fullscreen the page
   * document.getElementById('button-id').addEventListener('click', () => {
   *   fullscrn.request()
   * })
   *
   * // Fullscreen an element
   * document.getElementById('button-id').addEventListener('click', evt => {
   *   fullscrn.request(evt.currentTarget.parentElement)
   * })
   *
   * // Fullscreen an element with options
   * document.getElementById('button-id').addEventListener('click', evt => {
   *   fullscrn.request(evt.currentTarget.parentElement, { navigationUI: 'hide' })
   * })
   *```
   */
  request(element?: Element, options?: FullscreenOptions): Promise<void>

  /**
   * Brings you out of fullscreen.
   *
   * @returns A promise that resolves after the element exits fullscreen.
   */
  exit(): Promise<void>

  /**
   * Requests fullscreen if not active, otherwise exits.
   *
   * @param element - Default is `<html>`. If called with another element than the currently active, it will switch to that if it's a decendant.
   * @param options - [`FullscreenOptions`](https://developer.mozilla.org/en-US/docs/Web/API/FullscreenOptions).
   * @returns A promise that resolves after the element enters/exits fullscreen.
   *
   * @example
   *```js
   * // Toggle fullscreen on a image with jQuery
   * $('img').on('click', evt => {
   *   fullscrn.toggle(evt.target)
   * })
   *```
   */
  toggle(element?: Element, options?: FullscreenOptions): Promise<void>

  /**
   * An event handler for the `fullscreenchange` event that's sent to
   * a document when that document is placed into full-screen mode, or
   * when that document exits full-screen mode.
   *
   * This handler is called only when the entire document is presented in
   * full-screen mode.
   *
   * @example
   *```js
   * const remover = fullscrn.onchange(() => {
   *   console.log('Am I fullscreen?', fullscrn.isFullscreen ? 'Yes' : 'No')
   * })
   *
   * // Later, you can remove the listener by calling `remover`
   * remover()
   *```
   * ---
   * If you are using React. the removal is automatic if you return the result
   * of `onchange` to the `useEffect` hook:
   *```jsx
   * useEffect(
   *   () =>
   *     fullscrn.onchange(() => {
   *       console.log('Am I fullscreen?', fullscrn.isFullscreen ? 'Yes' : 'No')
   *     }),
   *   []
   * )
   *```
   */
  onchange(callback: FullscrnEventHandler): FullscrnUnsubscribe

  /**
   * An event handler for the `fullscreenerror` event that gets sent to
   * a document when an error occurs while trying to enable or disable
   * full-screen mode for the entire document.
   *
   * @example
   *```js
   * // Register the error handler with onerror and store the result (`remover`).
   * // Later, you can remove the listener by calling `remover()`.
   * //
   * const remover = fullscrn.onerror(event => {
   *   console.error('Failed to enable fullscreen', event)
   * })
   *```
   */
  onerror(callback: FullscrnEventHandler): FullscrnUnsubscribe
}

const enum FnIx {
  requestFullscreen,
  exitFullscreen,
  fullscreenElement,
  fullscreenEnabled,
  fullscreenchange,
  fullscreenerror,
}

export const fullscrn: Fullscrn = (function () {
  //
  const document: Document =
    (typeof window !== 'undefined' && window.document) || ({} as any)

  const fn = [
    [
      'requestFullscreen',
      'exitFullscreen',
      'fullscreenElement',
      'fullscreenEnabled',
      'fullscreenchange',
      'fullscreenerror',
    ],
    // New WebKit
    [
      'webkitRequestFullscreen',
      'webkitExitFullscreen',
      'webkitFullscreenElement',
      'webkitFullscreenEnabled',
      'webkitfullscreenchange',
      'webkitfullscreenerror',
    ],
  ].find(v => document[v[1]])

  if (!fn) {
    /*
      There's no Fullscreen support, returns a noop instance of Fullscrn
    */
    const _noopP = () => Promise.resolve()
    const _noopV = () => void 0
    const _noopZ = () => _noopV

    return {
      element: null,
      isEnabled: false,
      isFullscreen: false,
      request: _noopP,
      toggle: _noopP,
      exit: _noopP,
      onchange: _noopZ,
      onerror: _noopZ,
      _off: _noopV,
    }
  }

  const fullscreenElement = fn[FnIx.fullscreenElement]
  const fullscreenEnabled = fn[FnIx.fullscreenEnabled]
  const requestFullscreen = fn[FnIx.requestFullscreen]
  const exitFullscreen = fn[FnIx.exitFullscreen]

  const eventNames = {
    change: fn[FnIx.fullscreenchange],
    error: fn[FnIx.fullscreenerror],
  }

  // Fullscrn instance to fill with the methods in the context
  const _fullscrn = {
    //
    get element() {
      return document[fullscreenElement] as Element | null
    },

    get isFullscreen() {
      return Boolean(document[fullscreenElement])
    },

    get isEnabled() {
      return Boolean(document[fullscreenEnabled])
    },
  }

  /**
   * Remove a previously registered event listener.
   * @private
   */
  const _off = (event: EventName, callback: FullscrnEventHandler) => {
    const eventName = eventNames[event]
    eventName && document.removeEventListener(eventName, callback, false)
  }

  const onchange = (callback: FullscrnEventHandler) => {
    document.addEventListener(eventNames.change, callback, false)
    return () => _off('change', callback)
  }

  const onerror = (callback: FullscrnEventHandler) => {
    document.addEventListener(eventNames.error, callback, false)
    return () => _off('error', callback)
  }

  const request = (element: Element, options: FullscreenOptions) =>
    new Promise<void>((resolve, reject) => {
      //
      const onFullScreenEntered = () => {
        _off('change', onFullScreenEntered)
        resolve()
      }

      onchange(onFullScreenEntered)

      element ||= document.documentElement

      const promise = element[requestFullscreen](options)

      if (promise instanceof Promise) {
        promise.then(onFullScreenEntered).catch(reject)
      }
    })

  const exit = () =>
    new Promise<void>((resolve, reject) => {
      //
      if (!_fullscrn.isFullscreen) {
        resolve()
        return
      }

      const onFullScreenExit = () => {
        _off('change', onFullScreenExit)
        resolve()
      }

      onchange(onFullScreenExit)

      const promise = document[exitFullscreen]()

      if (promise instanceof Promise) {
        promise.then(onFullScreenExit).catch(reject)
      }
    })

  const toggle = (element: Element, options: FullscreenOptions) =>
    _fullscrn.isFullscreen ? exit() : request(element, options)

  return Object.assign(_fullscrn, {
    request,
    exit,
    toggle,
    onchange,
    onerror,
    _off,
  })
})()
