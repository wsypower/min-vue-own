/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 16:33:38
 * @LastEditTime: 2022-06-24 23:08:49
 * @LastEditors: wsy
 */
import { h } from '../lib/guide-mini-vue.esm.js';
import { Foo } from './foo.js';
const App = {
  render() {
    return h(
      'div',
      {
        class: ['test1', 'test2'],
        onClick() {
          console.log('click');
        },
      },
      [
        h('p', { class: 'test-p' }, 'hi'),
        h('p', { class: 'test-p' }, 'hi,' + this.msg),
        h(Foo, { count: 1 }),
      ]
    );
  },
  setup() {
    return {
      msg: 'mini-vue',
    };
  },
};

export { App };
