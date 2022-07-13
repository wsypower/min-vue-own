/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 16:33:38
 * @LastEditTime: 2022-07-14 00:56:19
 * @LastEditors: wsy
 */
import { h } from '../../lib/guide-mini-vue.esm.js';

export const App = {
  name: 'App',
  template: '<div>hi,{{message}}</div>',
  setup() {
    return {
      message: 'mini-vue',
    };
  },
};
