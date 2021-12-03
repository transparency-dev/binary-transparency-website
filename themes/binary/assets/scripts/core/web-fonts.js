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
/* globals  */

'use strict';

import webfontloader from 'webfontloader';
import { Deferred } from './utils';

export default class WebFonts {

  constructor() {
    this.ready = new Deferred();
    this.config = {
      classes: true,
      active: this.onSuccess.bind(this),
      inactive: this.onError.bind(this),
      google: {
        families: [
          'Ubuntu:400,500,700',
        ],
      },
    };
    this.init();
  }

  init() {
    webfontloader.load(this.config);
  }

  onSuccess() {
    this.onComplete();
  }

  onError() {
    this.onComplete();
  }

  onComplete() {
    this.ready.resolve();
  }
}
