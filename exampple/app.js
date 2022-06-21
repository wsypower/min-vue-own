/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 16:33:38
 * @LastEditTime: 2022-06-21 23:30:23
 * @LastEditors: wsy
 */
import { h } from '../lib/guide-mini-vue.esm.js';
const App = {
  render() {
    // return h('div', { class: 'test' }, [
    //   h('p', { class: 'test-p' }, 'hi'),
    //   h('p', { class: 'test-p' }, 'min-vue'),
    // ]);
    return h('div', { class: 'test1' }, 'hi' + '' + this.msg);
  },
  setup() {
    return {
      msg: 'mini-vue',
    };
  },
};

export { App };
