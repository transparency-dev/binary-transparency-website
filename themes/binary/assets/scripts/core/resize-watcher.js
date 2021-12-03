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

import {debounce} from 'lodash';

export default class ResizeWatcher {

  constructor() {
    this.data = this.getData();
    this.cache = {};
    this.interupt = 250;
    this.getDebouncedResizeDetails = debounce(() => this.getResizeDetails(), this.interupt);

    this.bind();
  }

  getData() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  bind() {
    this.getResizeDetails();
    window.addEventListener('resize', () => this.getDebouncedResizeDetails());
    window.addEventListener('scroll', () => this.getDebouncedResizeDetails());
  }

  getResizeDetails() {
    this.data = this.getData();
    if (this.cache !== this.data) {
      document.dispatchEvent(new CustomEvent('resize-watcher', {'detail': this.data}));
      this.cache = this.data;
    }
  }

}
