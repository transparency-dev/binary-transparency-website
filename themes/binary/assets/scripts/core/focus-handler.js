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
/* global document */

'use strict';

export default class FocusHandler {

  constructor(elem) {
    this._element = elem || document.body;
    this._inputType = 'mouse';
    this._restrictedTypes = ['mouse', 'touch'];
    this._restrictClass = 'focus-disabled';
    this._interactLock = false;

    this.addClass(this._element, this._restrictClass);
    this.bind();
  }

  bind() {
    this._element.addEventListener('mousedown', (e) => {
      this.interact(e);
    });

    this._element.addEventListener('touchstart', (e) => {
      this.interact(e);
    });

    this._element.addEventListener('keydown', (e) => {
      this.interact(e);
    });

    this._element.addEventListener('focus', () => {
      this.preFocus();
    }, true);

    this._element.addEventListener('blur', () => {
      this.preBlur();
    }, true);
  }

  interact(e) {
    if (!this._interactLock) {
      switch (e.type) {
        case 'mousedown':
          this._interactLock = false;
          this._inputType = 'mouse';
          break;
        case 'touchstart':
          this._interactLock = true;
          this._inputType = 'touch';
          break;
        default:
        case 'keydown':
          this._inputType = 'keyboard';
          break;
      }
    }
  }

  preFocus() {
    this._restrictedTypes.forEach(rtype => {
      if (this._inputType === rtype) {
        this.addClass(this._element, this._restrictClass);
      }
    });
  }

  removeClass(el, className) {
    if (el.classList.contains(className)) {
      el.classList.remove(className);
    }
  }

  preBlur() {
    this.removeClass(this._element, this._restrictClass);
  }

  hasClass(el, className) {
    return el.classList.contains(className);
  }

  addClass(el, className) {
    if (!el.classList.contains(className)) {
      el.classList.add(className);
    }
  }
}
