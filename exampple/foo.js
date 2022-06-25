/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-24 23:05:58
 * @LastEditTime: 2022-06-25 15:13:10
 * @LastEditors: wsy
 */
import { h } from '../lib/guide-mini-vue.esm.js';
export const Foo = {
  setup(props, { emit }) {
    console.log(props);
    const emitAdd = () => {
      console.log('emitAdd---->');
      emit('addFoo');
    };
    return {
      emitAdd,
    };
  },
  render() {
    const btn = h(
      'button',
      {
        onClick: this.emitAdd,
      },
      'emitAdd'
    );
    const foo = h('p', { class: 'foo' }, 'foo');
    return h('div', { class: 'foo' }, [foo, btn]);
  },
};
