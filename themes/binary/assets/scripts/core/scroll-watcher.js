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
/* global window, document, CustomEvent */

'use strict';

import {throttle} from 'lodash';

export default class ScrollWatcher {

  constructor() {
    this.data = this.getData();
    this.cache = {};
    this.interupt = 250;
    this.getThrottledScrollDetails = throttle(() => this.getScrollDetails(), this.interupt);

    this.bind();
  }

  getData() {
    const x = this.getScrollX();
    const y = this.getScrollY();
    const w = document.body.scrollWidth;
    const h = document.body.scrollHeight;

    return {
      x: x,
      y: y,
      width: w,
      height: h,
      top: this.getIsTop(y),
      right: this.getIsRight(x),
      bottom: this.getIsBottom(y),
      left: this.getIsLeft(x),
      direction: {
        x: this.getXDirection(x),
        y: this.getYDirection(y),
      },
    };
  }

  bind() {
    this.getScrollDetails();
    window.addEventListener('scroll', () => this.getThrottledScrollDetails());
  }

  getScrollDetails() {
    this.data = this.getData();
    if (this.cache !== this.data) {
      document.dispatchEvent(new CustomEvent('scroll-watcher', {'detail': this.data}));
      this.cache = this.data;
    }
  }

  forceUpdate() {
    this.data = this.getData();
    document.dispatchEvent(new CustomEvent('scroll-watcher', {'detail': this.data}));
    this.cache = this.data;
  }

  getXDirection(x) {
    if (this.cache) {
      if (x > this.cache.x) {
        return 'right';
      } else if (x < this.cache.x) {
        return 'left';
      }
    }
    return null;
  }

  getYDirection(y) {
    if (this.cache) {
      if (y > this.cache.y) {
        return 'down';
      } else if (y < this.cache.y) {
        return 'up';
      }
    }
    return null;
  }

  getScrollY() {
    return window.scrollY || window.scrollTop || document.documentElement.scrollTop;
  }

  getScrollX() {
    return window.scrollX || window.scrollLeft || document.documentElement.scrollLeft;
  }

  getIsTop(val) {
    return val === 0 ? true : false;
  }

  getIsLeft(val) {
    return val === 0 ? true : false;
  }

  getIsRight(val) {
    return val === (document.body.clientWidth - window.innerWidth) ? true : false;
  }

  getIsBottom(val) {
    return val === (document.body.clientHeight - window.innerHeight) ? true : false;
  }
}
