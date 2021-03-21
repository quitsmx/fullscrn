/*!
  @quitsmx/fullscrn v1.0.0
  Based on Sindre Sorhus' screenfull.js
  @license MIT
*/
const fullscrn = (function () {
    //
    const document = (typeof window !== 'undefined' && window.document) || {};
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
    ].find(v => document[v[1]]);
    if (!fn) {
        /*
          There's no Fullscreen support, returns a noop instance of Fullscrn
        */
        const _noopP = () => Promise.resolve();
        const _noopV = () => void 0;
        const _noopZ = () => _noopV;
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
        };
    }
    const fullscreenElement = fn[2 /* fullscreenElement */];
    const fullscreenEnabled = fn[3 /* fullscreenEnabled */];
    const requestFullscreen = fn[0 /* requestFullscreen */];
    const exitFullscreen = fn[1 /* exitFullscreen */];
    const eventNames = {
        change: fn[4 /* fullscreenchange */],
        error: fn[5 /* fullscreenerror */],
    };
    // Fullscrn instance to fill with the methods in the context
    const _fullscrn = {
        //
        get element() {
            return document[fullscreenElement];
        },
        get isFullscreen() {
            return Boolean(document[fullscreenElement]);
        },
        get isEnabled() {
            return Boolean(document[fullscreenEnabled]);
        },
    };
    /**
     * Remove a previously registered event listener.
     * @private
     */
    const _off = (event, callback) => {
        const eventName = eventNames[event];
        eventName && document.removeEventListener(eventName, callback, false);
    };
    const onchange = (callback) => {
        document.addEventListener(eventNames.change, callback, false);
        return () => _off('change', callback);
    };
    const onerror = (callback) => {
        document.addEventListener(eventNames.error, callback, false);
        return () => _off('error', callback);
    };
    const request = (element, options) => new Promise((resolve, reject) => {
        //
        const onFullScreenEntered = () => {
            _off('change', onFullScreenEntered);
            resolve();
        };
        onchange(onFullScreenEntered);
        element || (element = document.documentElement);
        const promise = element[requestFullscreen](options);
        if (promise instanceof Promise) {
            promise.then(onFullScreenEntered).catch(reject);
        }
    });
    const exit = () => new Promise((resolve, reject) => {
        //
        if (!_fullscrn.isFullscreen) {
            resolve();
            return;
        }
        const onFullScreenExit = () => {
            _off('change', onFullScreenExit);
            resolve();
        };
        onchange(onFullScreenExit);
        const promise = document[exitFullscreen]();
        if (promise instanceof Promise) {
            promise.then(onFullScreenExit).catch(reject);
        }
    });
    const toggle = (element, options) => _fullscrn.isFullscreen ? exit() : request(element, options);
    return Object.assign(_fullscrn, {
        request,
        exit,
        toggle,
        onchange,
        onerror,
        _off,
    });
})();

export { fullscrn };
//# sourceMappingURL=fullscrn.js.map
