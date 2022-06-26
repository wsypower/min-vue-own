/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-19 16:33:38
 * @LastEditTime: 2022-06-25 21:17:20
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
        h('p', { class: 'test-p' }, 'hi,' + this.msg),
        h(
          Foo,
          {
            count: 1,
            onAddFoo() {
              console.log('这是收到了add');
              console.log(this);
            },
          },
          {
            header: ({ age }) => h('p', { class: 'header' }, 'header' + age),
            footer: () => h('p', { class: 'footer' }, 'footer'),
          }
          // [h('p', { class: 'slot' }, '1'), h('p', { class: 'slot' }, '2')],
        ),
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
