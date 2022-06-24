/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 16:33:38
 * @LastEditTime: 2022-06-24 22:31:18
 * @LastEditors: wsy
 */
import { h } from '../lib/guide-mini-vue.esm.js';
const App = {
  render() {
    // return h('div', { class: 'test' }, [
    //   h('p', { class: 'test-p' }, 'hi'),
    //   h('p', { class: 'test-p' }, 'min-vue'),
    // ]);
    return h(
      'div',
      {
        class: ['test1', 'test2'],
        onClick() {
          console.log('click');
        },
      },
      'hi' + '' + this.msg
    );
  },
  setup() {
    return {
      msg: 'mini-vue',
    };
  },
};

export { App };
