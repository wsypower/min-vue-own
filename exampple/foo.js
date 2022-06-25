/*
 * @Description:
 * @Author: wsy
 * @Date: 2022-06-24 23:05:58
 * @LastEditTime: 2022-06-25 19:33:09
 * @LastEditors: wsy
 */
import { h, renderSlots } from '../lib/guide-mini-vue.esm.js';
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
    const age = '我18岁了';
    return h('div', { class: 'foo' }, [
      renderSlots(this.$slots, 'header', { age }),
      foo,
      btn,
      renderSlots(this.$slots, 'footer'),
    ]);
  },
};
