/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-24 23:05:58
 * @LastEditTime: 2022-06-24 23:07:13
 * @LastEditors: wsy
 */
import { h } from '../lib/guide-mini-vue.esm.js';
export const Foo = {
  setup(props) {
    console.log(props);
  },
  render() {
    return h('div', { class: 'foo' }, 'foo:' + this.count);
  },
};
