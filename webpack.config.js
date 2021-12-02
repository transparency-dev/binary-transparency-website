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
/* globals module require */

const Terser = require('terser-webpack-plugin');
const path = require('path');

module.exports = {
  entry: [path.resolve('themes/binary/assets/scripts', 'app.js')],
  module: {
    rules: [{
      loader: 'babel-loader',
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
    }],
  },
  output: {
    path: path.resolve('themes/binary/assets/built', 'js'),
    filename: '[name].min.js',
    chunkFilename: '[name].min.js',
    crossOriginLoading: 'anonymous',
  },
  optimization: {
    minimizer: [new Terser({
      test: /\.m?js$/,
      terserOptions: {
        output: {
          preamble: `
/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/
         `,
          comments: false,
        },
      },
    })],
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: /(node_modules|bower_components)/,
          enforce: true,
        },
      },
    },
  },
};
