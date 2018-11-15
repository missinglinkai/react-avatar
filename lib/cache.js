"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CACHE_KEY_FAILING = exports.CACHE_PREFIX = void 0;
var CACHE_PREFIX = 'react-avatar/';
exports.CACHE_PREFIX = CACHE_PREFIX;
var CACHE_KEY_FAILING = 'failing';
exports.CACHE_KEY_FAILING = CACHE_KEY_FAILING;

var _hasLocalStorage = function isLocalStorageAvailable() {
  try {
    return 'localStorage' in window && window['localStorage'];
  } catch (err) {
    return false;
  }
}();

var _default = {
  set: function set(key, value) {
    // cache not available
    if (!_hasLocalStorage) return;
    value = JSON.stringify(value);

    try {
      localStorage.setItem(CACHE_PREFIX + key, value);
    } catch (e) {
      // failsafe for mobile Safari private mode
      console.error(e); // eslint-disable-line no-console
    }
  },
  get: function get(key) {
    var value = localStorage.getItem(CACHE_PREFIX + key);
    if (value) return JSON.parse(value);
    return null;
  },
  sourceFailed: function sourceFailed(source) {
    var cacheList = this.get(CACHE_KEY_FAILING) || []; // already in cache

    if (cacheList.indexOf(source) > -1) return;
    cacheList.push(source); // only keep the last 20 results so we don't fill up local storage

    cacheList = cacheList.slice(-20);
    return this.set(CACHE_KEY_FAILING, cacheList);
  },
  hasSourceFailedBefore: function hasSourceFailedBefore(source) {
    var cacheList = this.get(CACHE_KEY_FAILING) || [];
    return cacheList.indexOf(source) > -1;
  }
};
exports.default = _default;