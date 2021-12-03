/*
  Copyright 2021 Google LLC

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
/* globals window */

'use strict';

export class Cookies {

  constructor() {}

  setCookie(name, value, expiryHours) {
    let expires = '';
    if (expiryHours) {
      const date = new Date();
      date.setTime(date.getTime() + (expiryHours * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  }

  getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }
}

export class LocalStorage {
  constructor() {}

  setStorage(name, value) {
    window.localStorage.setItem(name, value);
  }

  getStorage(name) {
    return window.localStorage.getItem(name) || null;
  }
}

export class Deferred {

  constructor() {
    this.resolve = () => {};
    this.reject = () => {};
    this.promise = new window.Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
