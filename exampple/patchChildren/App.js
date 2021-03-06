/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-27 11:04:49
 * @LastEditTime: 2022-07-02 17:06:10
 * @LastEditors: wsy
 */
import { h, ref } from '../../lib/guide-mini-vue.esm.js';
import ArrayToText from './ArrayToText.js';
import TextToText from './TextToText.js';
import TextToArray from './TextToArray.js';
import ArrayToArray from './ArrayToArray.js';
export default {
  name: 'App',
  setup() {},
  render() {
    return h('div', { tId: 1 }, [
      h('p', {}, '主页'),
      // 老的是 array 新的是 text
      // h(ArrayToText),
      // 老的是 text 新的是 text
      // h(TextToText),
      // 老的是 text 新的是 array
      // h(TextToArray),
      // 老的是 Array 新的是 Array
      h(ArrayToArray),
    ]);
  },
};
