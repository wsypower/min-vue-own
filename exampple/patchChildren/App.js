/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-27 11:04:49
 * @LastEditTime: 2022-07-01 10:57:25
 * @LastEditors: wsy
 */
import { h, ref } from '../../lib/guide-mini-vue.esm.js';
import ArrayToText from './ArrayToText.js';
export default {
  name: 'App',
  setup() {},
  render() {
    return h('div', { tId: 1 }, [
      h('p', {}, '主页'),
      // 老的是 array 新的是 text
      h(ArrayToText),
    ]);
  },
};
